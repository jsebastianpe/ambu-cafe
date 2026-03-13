import React from 'react';
import './About.css';

const About = () => {
  const aboutData = [
    {
      icon: '🌱',
      title: 'Misión',
      content:
        'Ofrecer café de la más alta calidad, cultivado de manera sostenible y ética, que conecte a las personas con el origen y la pasión detrás de cada taza. Promovemos el comercio justo y el respeto por nuestros caficultores.',
    },
    {
      icon: '🔭',
      title: 'Visión',
      content:
        'Ser reconocidos como la marca líder en café premium sostenible, inspirando a las comunidades a valorar la calidad, el origen y el impacto social de cada producto que consumen.',
    },
    {
      icon: '💎',
      title: 'Valores',
      content:
        'Calidad excepcional, sostenibilidad ambiental, comercio justo, transparencia en el origen, pasión por el café, innovación constante y compromiso con nuestras comunidades cafeteras.',
    },
  ];

  return (
    <section id="nosotros" className="about-section">
      <h2 className="section-title">Nuestra Esencia</h2>
      <p className="section-subtitle">Más que café, una experiencia sensorial</p>

      <div className="about-grid">
        {aboutData.map((item, index) => (
          <div key={index} className="about-card">
            <h3>
              {item.icon} {item.title}
            </h3>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;