// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Product Categories
export const CATEGORIES = {
  ALL: 'todos',
  BEANS: 'granos',
  GROUND: 'molido',
  READY: 'listo',
};

export const CATEGORY_LABELS = {
  [CATEGORIES.ALL]: 'Todos',
  [CATEGORIES.BEANS]: 'Granos',
  [CATEGORIES.GROUND]: 'Molido',
  [CATEGORIES.READY]: 'Listo para Tomar',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'ambu_cart',
  USER: 'ambu_user',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pendiente',
  PROCESSING: 'procesando',
  SHIPPED: 'enviado',
  DELIVERED: 'entregado',
  CANCELLED: 'cancelado',
};

// Contact Info
export const CONTACT_INFO = {
  address: 'Finca La Quindiana, Vereda Santo Domingo, Calarcá - Quindío',
  email: 'ambucoffee28@gmail.com',
  phone: '+57 302 2748620',
  hours: {
    weekdays: 'Lunes a Viernes: 8am - 6pm',
    saturday: 'Sábados: 9am - 3pm',
  },
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=61585305554310',
  instagram: 'https://www.instagram.com/ambucoffee.co/',
  twitter: 'https://twitter.com/ambucoffee',
  linkedin: 'https://linkedin.com/company/ambucoffee',
};