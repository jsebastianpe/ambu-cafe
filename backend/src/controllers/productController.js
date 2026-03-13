const { getAllProducts, getProductById } = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = (req, res) => {
  try {
    const products = getAllProducts();
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = (req, res) => {
  try {
    const product = getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
};