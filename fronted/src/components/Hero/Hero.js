import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <h1>Am Bú</h1>
        <p>
          Despierta tus sentidos con café de alta montaña, cultivado con pasión
          y respeto por la tierra
        </p>
        <div className="hero-buttons">
          <button
            className="btn btn-primary"
            onClick={() => scrollToSection('productos')}
          >
            Explorar Productos
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => scrollToSection('nosotros')}
          >
            Conoce Nuestra Historia
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;