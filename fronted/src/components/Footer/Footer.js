import React from 'react';
import { SOCIAL_LINKS } from '../../utils/Constants';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">
            📘
          </a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
            📷
          </a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer">
            🐦
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            💼
          </a>
        </div>
        <p>&copy; 2024 Am Bu Coffee. Todos los derechos reservados.</p>
        <p className="made-with">Hecho con ❤️ y ☕ en Colombia</p>
      </div>
    </footer>
  );
};

export default Footer;