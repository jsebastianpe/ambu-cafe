import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CATEGORIES, CATEGORY_LABELS } from '../../utils/Constants';
import './Navbar.css';

const Navbar = () => {
  const { getCartCount, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
    setOpenSubmenu(null);
  };

  const scrollToAboutSection = (subsection) => {
    const element = document.getElementById('nosotros');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
    setOpenSubmenu(null);
    
    setTimeout(() => {
      const cards = document.querySelectorAll('.about-card');
      const index = subsection === 'mision' ? 0 : subsection === 'vision' ? 1 : 2;
      if (cards[index]) {
        cards[index].style.transform = 'scale(1.05)';
        setTimeout(() => {
          cards[index].style.transform = '';
        }, 1000);
      }
    }, 500);
  };

  const filterProducts = (category) => {
    scrollToSection('productos');
    setTimeout(() => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
        if (btn.textContent === CATEGORY_LABELS[category]) {
          btn.click();
        }
      });
    }, 500);
  };

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenSubmenu(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Menú Hamburguesa - AHORA A LA IZQUIERDA */}
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Logo en el centro */}
        <div className="logo" onClick={() => scrollToSection('inicio')}>
          Am Bú
        </div>

        {/* Menú Desktop (oculto) */}
        <ul className="nav-links desktop-menu">
          <li>
            <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollToSection('inicio'); }}>
              Inicio
            </a>
          </li>
          <li>
            <a href="#nosotros" onClick={(e) => { e.preventDefault(); scrollToSection('nosotros'); }}>
              Nosotros
            </a>
          </li>
          <li>
            <a href="#productos" onClick={(e) => { e.preventDefault(); scrollToSection('productos'); }}>
              Productos
            </a>
          </li>
          <li>
            <a href="#ayuda" onClick={(e) => { e.preventDefault(); scrollToSection('ayuda'); }}>
              Ayuda
            </a>
          </li>
          <li>
            <a href="#contacto" onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}>
              Contacto
            </a>
          </li>
        </ul>

        {/* Ícono del Carrito a la derecha */}
        <div className="cart-icon" onClick={toggleCart}>
          🛒
          {getCartCount() > 0 && (
            <span className="cart-count">{getCartCount()}</span>
          )}
        </div>
      </div>

      {/* Menú Lateral Deslizable DESDE LA IZQUIERDA */}
      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* Inicio */}
          <div className="menu-item">
            <button 
              className="menu-link"
              onClick={() => scrollToSection('inicio')}
            >
              🏠 Inicio
            </button>
          </div>

          {/* Nosotros con Submenú */}
          <div className="menu-item">
            <button 
              className="menu-link"
              onClick={() => toggleSubmenu('nosotros')}
            >
              🌟 Nosotros
              <span className={`arrow ${openSubmenu === 'nosotros' ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`submenu ${openSubmenu === 'nosotros' ? 'open' : ''}`}>
              <button onClick={() => scrollToAboutSection('mision')}>
                🌱 Misión
              </button>
              <button onClick={() => scrollToAboutSection('vision')}>
                🔭 Visión
              </button>
              <button onClick={() => scrollToAboutSection('valores')}>
                💎 Valores
              </button>
            </div>
          </div>

          {/* Productos con Submenú */}
          <div className="menu-item">
            <button 
              className="menu-link"
              onClick={() => toggleSubmenu('productos')}
            >
              ☕ Productos
              <span className={`arrow ${openSubmenu === 'productos' ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`submenu ${openSubmenu === 'productos' ? 'open' : ''}`}>
              <button onClick={() => filterProducts(CATEGORIES.ALL)}>
                📋 Todos los Productos
              </button>
              <button onClick={() => filterProducts(CATEGORIES.BEANS)}>
                🫘 Café en Granos
              </button>
              <button onClick={() => filterProducts(CATEGORIES.GROUND)}>
                🥄 Café Molido
              </button>
              <button onClick={() => filterProducts(CATEGORIES.READY)}>
                🥤 Listo para Tomar
              </button>
            </div>
          </div>

          {/* Centro de Ayuda */}
          <div className="menu-item">
            <button 
              className="menu-link"
              onClick={() => scrollToSection('ayuda')}
            >
              ❓ Centro de Ayuda
            </button>
          </div>

          {/* Contacto con Submenú */}
          <div className="menu-item">
            <button 
              className="menu-link"
              onClick={() => toggleSubmenu('contacto')}
            >
              📞 Contacto
              <span className={`arrow ${openSubmenu === 'contacto' ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`submenu ${openSubmenu === 'contacto' ? 'open' : ''}`}>
              <button onClick={() => scrollToSection('contacto')}>
                📧 Enviar Mensaje
              </button>
              <button onClick={() => scrollToSection('contacto')}>
                📍 Información de Contacto
              </button>
            </div>
          </div>

          {/* Carrito */}
          <div className="menu-item">
            <button 
              className="menu-link cart-menu-item"
              onClick={() => { toggleCart(); setIsMenuOpen(false); }}
            >
              🛒 Mi Carrito
              {getCartCount() > 0 && (
                <span className="menu-cart-badge">{getCartCount()}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay cuando el menú está abierto */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={toggleMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;