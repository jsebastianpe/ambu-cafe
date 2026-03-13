import React from 'react';
import './Help.css';

const Help = () => {
  const helpItems = [
    {
      icon: '📦',
      title: 'Envíos',
      description: 'Envío gratis en compras superiores a $50. Entregas en 3-5 días hábiles.',
    },
    {
      icon: '🔄',
      title: 'Devoluciones',
      description: '30 días para devolver productos sin abrir. Proceso simple y sin complicaciones.',
    },
    {
      icon: '💳',
      title: 'Pagos Seguros',
      description: 'Aceptamos todas las tarjetas y métodos de pago. Transacciones encriptadas.',
    },
    {
      icon: '☕',
      title: 'Preparación',
      description: 'Guías detalladas para preparar el café perfecto con cada método.',
    },
  ];

  return (
    <section id="ayuda" className="help-section">
      <h2 className="section-title">Centro de Ayuda</h2>
      <p className="section-subtitle">Estamos aquí para asistirte</p>

      <div className="help-grid">
        {helpItems.map((item, index) => (
          <div key={index} className="help-card">
            <div className="help-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Help;