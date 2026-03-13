// Product Model
// En producción, esto se conectaría a una base de datos

class Product {
  constructor(id, name, description, price, category, image, stock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.image = image;
    this.stock = stock;
  }
}

// Base de datos en memoria (simulada)
let products = [
  new Product(
    1,
    'Café Castillo Arábico',
    'Certificado de especialidad, arábica de alta montaña, sabor suave y aromático',
    45000,
    'granos',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    50
  ),
  new Product(
    2,
    'Café Catimor fermentado',
    'Certificado de especialidad y SCA, 120 horas de fermentación',
    53000,
    'granos',
    'https://nudoverde.com.mx/wp-content/uploads/2025/03/PUEBLACATURRA.jpg',
    45
  ),
  new Product(
    3,
    'Café Castillo Arábico',
    'Molido medio perfecto para filtro y prensa francesa',
    45000,
    'molido',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    60
  ),
  new Product(
    4,
    'Cold Brew Concentrate',
    'Concentrado de café frío, listo para mezclar',
    38000,
    'listo',
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    30
  ),
  new Product(
    5,
    '1/2 Café Castillo Arábico',
    'Certificado de especialidad, arábica de alta montaña, sabor suave y aromático',
    28000,
    'granos',
    'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400',
    40
  ),
  new Product(
    6,
    '1/2 Café Catimor Fermentado',
    'Certificado de especialidad y SCA, 120 horas de fermentación',
    28000,
    'granos',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400',
    35
  ),
];

module.exports = {
  Product,
  getAllProducts: () => products,
  getProductById: (id) => products.find((p) => p.id === parseInt(id)),
  updateProductStock: (id, quantity) => {
    const product = products.find((p) => p.id === parseInt(id));
    if (product) {
      product.stock -= quantity;
      return product;
    }
    return null;
  },
};