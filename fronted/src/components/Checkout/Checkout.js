import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const Checkout = ({ onClose }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: '',
    city: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    // Validar campos
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsProcessing(true);

    // Configuración de Wompi
    const checkout = new window.WidgetCheckout({
      currency: 'COP',
      amountInCents: Math.round(getCartTotal() * 100), // Convertir a centavos
      reference: `AMBU-${Date.now()}`, // Referencia única
      publicKey: 'pub_test_G6lFMgvertIHDOmkShAv3pIE9sleGaBL', // REEMPLAZA con tu clave pública de producción
      redirectUrl: window.location.origin + '/payment-success', // URL de retorno
      
      // Métodos de pago disponibles
      paymentMethods: {
        card: true,           // Tarjetas crédito/débito
        pse: true,            // PSE
        nequi: true,          // Nequi
        bancolombia: true,    // Bancolombia
      },

      // Información del cliente
      customerData: {
        email: customerInfo.email,
        fullName: customerInfo.name,
        phoneNumber: customerInfo.phone,
        phoneNumberPrefix: '+57',
        legalId: customerInfo.document,
        legalIdType: 'CC', // CC, CE, NIT, etc.
      },

      // Información de envío
      shippingAddress: {
        addressLine1: customerInfo.address,
        city: customerInfo.city,
        country: 'CO',
        phoneNumber: customerInfo.phone,
        region: customerInfo.city,
      },

      // Información de los productos (opcional pero recomendado)
      customerDetails: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: Math.round(item.price * 100),
      })),
    });

    checkout.open((result) => {
      const transaction = result.transaction;
      
      if (transaction.status === 'APPROVED') {
        // Pago aprobado
        alert('¡Pago exitoso! Recibirás un email de confirmación.');
        clearCart();
        onClose();
        // Opcional: redirigir a página de confirmación
        window.location.href = '/order-confirmation?ref=' + transaction.reference;
      } else if (transaction.status === 'DECLINED') {
        // Pago rechazado
        alert('El pago fue rechazado. Por favor intenta con otro método de pago.');
      } else if (transaction.status === 'PENDING') {
        // Pago pendiente (común con PSE)
        alert('Tu pago está siendo procesado. Te notificaremos cuando se confirme.');
        clearCart();
        onClose();
      } else {
        // Otros estados
        alert('Hubo un problema con el pago. Por favor intenta nuevamente.');
      }
      
      setIsProcessing(false);
    });
  };

  return (
    <div className="checkout-modal">
      <div className="checkout-content">
        <div className="checkout-header">
          <h2>Finalizar Compra</h2>
          <span className="close-checkout" onClick={onClose}>×</span>
        </div>

        <div className="checkout-body">
          {/* Resumen del pedido */}
          <div className="order-summary">
            <h3>Resumen del Pedido</h3>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total:</strong>
              <strong>${getCartTotal().toFixed(2)} COP</strong>
            </div>
          </div>

          {/* Formulario de datos del cliente */}
          <div className="customer-form">
            <h3>Información de Contacto</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="3001234567"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Documento de Identidad</label>
                <input
                  type="text"
                  name="document"
                  value={customerInfo.document}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                />
              </div>

              <div className="form-group">
                <label>Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  placeholder="Bogotá"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Dirección de Envío</label>
              <input
                type="text"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                placeholder="Calle 123 #45-67"
              />
            </div>
          </div>

          {/* Métodos de pago disponibles */}
          <div className="payment-methods-info">
            <h3>Métodos de Pago Disponibles</h3>
            <div className="payment-icons">
              <div className="payment-method">
                <span>💳</span>
                <p>Tarjetas Débito/Crédito</p>
              </div>
              <div className="payment-method">
                <span>🏦</span>
                <p>PSE - Todos los bancos</p>
              </div>
              <div className="payment-method">
                <span>📱</span>
                <p>Nequi</p>
              </div>
              <div className="payment-method">
                <span>🏛️</span>
                <p>Bancolombia</p>
              </div>
            </div>
          </div>

          {/* Botón de pagar */}
          <button
            className="btn-pay"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Procesando...' : `Pagar $${getCartTotal().toFixed(2)} COP`}
          </button>

          <div className="secure-payment">
            <span>🔒</span>
            <p>Pago 100% seguro y encriptado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;