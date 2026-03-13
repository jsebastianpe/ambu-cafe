const express = require('express');
const router = express.Router();
const {
  wompiWebhook,
  getTransactionStatus,
} = require('../controllers/paymentController');

// Webhook de Wompi (recibe notificaciones de pago)
router.post('/webhook', wompiWebhook);

// Consultar estado de transacción
router.get('/transaction/:reference', getTransactionStatus);

module.exports = router;