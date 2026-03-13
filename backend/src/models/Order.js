// Order Model
// En producción, esto se conectaría a una base de datos

class Order {
  constructor(id, items, customer, total, status = 'pendiente') {
    this.id = id;
    this.items = items;
    this.customer = customer;
    this.total = total;
    this.status = status;
    this.date = new Date();
  }
}

// Base de datos en memoria
let orders = [];
let orderIdCounter = 1;

module.exports = {
  Order,
  getAllOrders: () => orders,
  getOrderById: (id) => orders.find((o) => o.id === parseInt(id)),
  createOrder: (items, customer, total) => {
    const order = new Order(orderIdCounter++, items, customer, total);
    orders.push(order);
    return order;
  },
  updateOrderStatus: (id, status) => {
    const order = orders.find((o) => o.id === parseInt(id));
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  },
};