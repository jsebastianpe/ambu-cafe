// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
const sendContactMessage = (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validar datos
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: name, email, message',
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido',
      });
    }

    // En producción, aquí se enviaría un email real
    console.log('Nuevo mensaje de contacto:', {
      name,
      email,
      subject,
      message,
      date: new Date(),
    });

    res.json({
      success: true,
      message: 'Mensaje recibido. Te contactaremos pronto.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al enviar mensaje',
      error: error.message,
    });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = (req, res) => {
  try {
    const { email } = req.body;

    // Validar datos
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido',
      });
    }

    // Validar formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido',
      });
    }

    // En producción, guardar en base de datos o servicio de email marketing
    console.log('Nueva suscripción al newsletter:', email);

    res.json({
      success: true,
      message: 'Gracias por suscribirte a nuestro newsletter',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al suscribir',
      error: error.message,
    });
  }
};

module.exports = {
  sendContactMessage,
  subscribeNewsletter,
};