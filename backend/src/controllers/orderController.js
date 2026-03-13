const { createOrder, getAllOrders, getOrderById } = require('../models/Order');
const { getProductById, updateProductStock } = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createNewOrder = (req, res) => {
  try {
    const { items, customer, total } = req.body;

    // Validar datos requeridos
    if (!items || !customer || !total) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: items, customer, total',
      });
    }

    // Validar stock disponible
    for (let item of items) {
      const product = getProductById(item.id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Producto con ID ${item.id} no encontrado`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
        });
      }
    }

    // Actualizar stock
    items.forEach((item) => {
      updateProductStock(item.id, item.quantity);
    });

    // Crear orden
    const order = createOrder(items, customer, total);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear pedido',
      error: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (en producción requeriría autenticación)
const getOrders = (req, res) => {
  try {
    const orders = getAllOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos',
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = (req, res) => {
  try {
    const order = getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedido',
      error: error.message,
    });
  }
};

module.exports = {
  createNewOrder,
  getOrders,
  getOrder,
};