import React, { useState } from 'react';
import { CONTACT_INFO } from '../../utils/Constants';
import apiService from '../../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.sendContactMessage(formData);
      alert('¡Gracias por contactarnos! Te responderemos pronto.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Error al enviar el mensaje.');
    }
  };

  return (
    <section id="contacto" className="contact-section">
      <h2 className="section-title">Contáctanos</h2>
      <p className="section-subtitle">Nos encantaría saber de ti</p>

      <div className="contact-container">
        <div className="contact-info">
          <h3>Información de Contacto</h3>
          
          <div className="contact-item">
            <i>📍</i>
            <div>
              <strong>Dirección</strong>
              <br />
              {CONTACT_INFO.address}
            </div>
          </div>

          <div className="contact-item">
            <i>📧</i>
            <div>
              <strong>Email</strong>
              <br />
              {CONTACT_INFO.email}
            </div>
          </div>

          <div className="contact-item">
            <i>📱</i>
            <div>
              <strong>Teléfono</strong>
              <br />
              {CONTACT_INFO.phone}
            </div>
          </div>

          <div className="contact-item">
            <i>⏰</i>
            <div>
              <strong>Horario</strong>
              <br />
              {CONTACT_INFO.hours.weekdays}
              <br />
              {CONTACT_INFO.hours.saturday}
            </div>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label>Asunto</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Cuéntanos más detalles..."
              />
            </div>

            <button type="submit" className="btn btn-primary submit-btn">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;