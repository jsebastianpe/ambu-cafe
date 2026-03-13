import React from 'react';
import { useCart } from '../../context/CartContext';
import './Productcard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    // Optional: Show toast notification
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;