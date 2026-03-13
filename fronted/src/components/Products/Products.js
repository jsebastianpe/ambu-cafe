import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES, CATEGORY_LABELS } from '../../utils/Constants';
import ProductCard from './Productcard';
import './Products.css';

const Products = () => {
  const { products, loading, error } = useProducts();
  const [activeFilter, setActiveFilter] = useState(CATEGORIES.ALL);

  const filteredProducts =
    activeFilter === CATEGORIES.ALL
      ? products
      : products.filter((product) => product.category === activeFilter);

  if (loading) {
    return (
      <section id="productos" className="products-section">
        <div className="loading">Cargando productos...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="productos" className="products-section">
        <div className="error">Error al cargar productos: {error}</div>
      </section>
    );
  }

  return (
    <section id="productos" className="products-section">
      <h2 className="section-title">Nuestros Cafés</h2>
      <p className="section-subtitle">Selección premium de granos excepcionales</p>

      <div className="product-filters">
        {Object.values(CATEGORIES).map((category) => (
          <button
            key={category}
            className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
            onClick={() => setActiveFilter(category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          No hay productos disponibles en esta categoría
        </div>
      )}
    </section>
  );
};

export default Products;