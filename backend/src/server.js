const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // ⬅️ AGREGAR ESTA LÍNEA

// Initialize app
const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use(`${config.apiPrefix}/products`, productRoutes);
app.use(`${config.apiPrefix}/orders`, orderRoutes);
app.use(`${config.apiPrefix}/contact`, contactRoutes);
app.use(`${config.apiPrefix}/payments`, paymentRoutes); // ⬅️ AGREGAR ESTA LÍNEA

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Error handler (debe ir al final)
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║   Am Bu Coffee API Server Running     ║
    ╠════════════════════════════════════════╣
    ║   Port: ${config.port}                       ║
    ║   Environment: ${config.nodeEnv}         ║
    ║   URL: http://localhost:${config.port}        ║
    ╚════════════════════════════════════════╝
  `);
});

module.exports = app;