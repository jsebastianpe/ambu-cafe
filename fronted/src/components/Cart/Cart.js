import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Checkout from '../Checkout/Checkout';
import './Cart.css';

const Cart = () => {
  const {
    cart,
    isCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    toggleCart,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
    toggleCart(); // Cerrar el carrito
  };

  if (!isCartOpen && !showCheckout) return null;

  return (
    <>
      {/* Modal del Carrito */}
      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <div className="cart-header">
              <h2>Tu Carrito</h2>
              <span className="close-cart" onClick={toggleCart}>
                ×
              </span>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Tu carrito está vacío</p>
                  <p className="empty-cart-subtitle">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">${item.price}</div>
                        <div className="cart-item-quantity">
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </span>
                    </div>
                  ))}

                  <div className="cart-total">
                    <span className="cart-total-label">Total:</span>
                    <span className="cart-total-amount">
                      ${getCartTotal().toFixed(2)} COP
                    </span>
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceder al Pago
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      {showCheckout && (
        <Checkout onClose={() => setShowCheckout(false)} />
      )}
    </>
  );
};

export default Cart;