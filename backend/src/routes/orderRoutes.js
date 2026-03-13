const express = require('express');
const router = express.Router();
const {
  createNewOrder,
  getOrders,
  getOrder,
} = require('../controllers/orderController');

// Routes
router.post('/', createNewOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;