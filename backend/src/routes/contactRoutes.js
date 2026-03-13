const express = require('express');
const router = express.Router();
const {
  sendContactMessage,
  subscribeNewsletter,
} = require('../controllers/contactController');

// Routes
router.post('/', sendContactMessage);
router.post('/newsletter', subscribeNewsletter);

module.exports = router;