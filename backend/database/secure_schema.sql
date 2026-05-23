-- =============================================
-- AM BU COFFEE - ESQUEMA ULTRA SEGURO
-- PostgreSQL 14+
-- =============================================

-- =============================================
-- EXTENSIONES DE SEGURIDAD
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TIPOS PERSONALIZADOS (ENUMS)
-- =============================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('CC', 'CE', 'NIT', 'Pasaporte', 'TI');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'disputed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('CARD', 'PSE', 'NEQUI', 'BANCOLOMBIA', 'CASH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'spam', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- FUNCIONES DE VALIDACIÓN
-- =============================================

-- Validar Email
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
           AND length(email) <= 255
           AND email NOT LIKE '%@example.%'
           AND email NOT LIKE '%@test.%';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Validar Teléfono Colombiano
CREATE OR REPLACE FUNCTION is_valid_phone_co(phone TEXT) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN phone ~ '^3[0-9]{9}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Detectar contenido malicioso
CREATE OR REPLACE FUNCTION contains_malicious_content(content TEXT) 
RETURNS BOOLEAN AS $$
BEGIN
    IF content IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN content ~* '(--|;|\/\*|\*\/|xp_|sp_|exec|execute|script|alert|onerror|onclick|javascript:|<script|union.*select|insert.*into|update.*set|delete.*from|drop.*table)';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- TABLA: security_events (Para logs de seguridad)
-- =============================================
CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id INTEGER,
    order_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_created ON security_events(created_at DESC);

-- =============================================
-- TABLA: rate_limits
-- =============================================
CREATE TABLE IF NOT EXISTS rate_limits (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    attempts INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier, action);
CREATE INDEX idx_rate_limits_blocked ON rate_limits(blocked_until);

-- Función de rate limiting
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier VARCHAR,
    p_action VARCHAR,
    p_max_attempts INTEGER,
    p_window_minutes INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_attempts INTEGER;
    v_blocked_until TIMESTAMP;
BEGIN
    -- Verificar si está bloqueado
    SELECT blocked_until INTO v_blocked_until
    FROM rate_limits
    WHERE identifier = p_identifier 
      AND action = p_action
      AND blocked_until > CURRENT_TIMESTAMP
    LIMIT 1;
    
    IF v_blocked_until IS NOT NULL THEN
        RAISE EXCEPTION 'Bloqueado temporalmente hasta: %', v_blocked_until;
    END IF;
    
    -- Limpiar intentos antiguos
    DELETE FROM rate_limits
    WHERE identifier = p_identifier
      AND action = p_action
      AND window_start < (CURRENT_TIMESTAMP - (p_window_minutes || ' minutes')::INTERVAL);
    
    -- Contar intentos
    SELECT COALESCE(SUM(attempts), 0) INTO v_attempts
    FROM rate_limits
    WHERE identifier = p_identifier
      AND action = p_action
      AND window_start >= (CURRENT_TIMESTAMP - (p_window_minutes || ' minutes')::INTERVAL);
    
    -- Si excede, bloquear
    IF v_attempts >= p_max_attempts THEN
        INSERT INTO rate_limits (identifier, action, attempts, blocked_until)
        VALUES (p_identifier, p_action, 1, CURRENT_TIMESTAMP + INTERVAL '1 hour');
        
        RAISE EXCEPTION 'Demasiados intentos. Bloqueado por 1 hora';
    END IF;
    
    -- Registrar intento
    INSERT INTO rate_limits (identifier, action, attempts)
    VALUES (p_identifier, p_action, 1);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TABLA: users (SEGURA)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    document_type document_type,
    document_number VARCHAR(50),
    role user_role DEFAULT 'customer' NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0 NOT NULL,
    last_failed_login TIMESTAMP,
    last_login TIMESTAMP,
    last_login_ip INET,
    registration_ip INET,
    user_agent TEXT,
    is_suspected_bot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT check_valid_email CHECK (is_valid_email(email)),
    CONSTRAINT check_no_malicious_name CHECK (NOT contains_malicious_content(full_name)),
    CONSTRAINT check_password_length CHECK (length(password_hash) >= 60 OR password_hash IS NULL)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_uuid ON users(uuid);

-- =============================================
-- TABLA: products (SEGURA)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    category_id INTEGER,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0.01 AND price <= 999999.99),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku VARCHAR(100) UNIQUE,
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT check_no_malicious_prod_name CHECK (NOT contains_malicious_content(name)),
    CONSTRAINT check_valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(active);

-- =============================================
-- FUNCIÓN: Actualizar updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();