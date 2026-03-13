import React from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Products from './components/Products/Products';
import Help from './components/Help/Help';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import './styles/global.css';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Navbar />
        <Hero />
        <About />
        <Products />
        <Help />
        <Contact />
        <Footer />
        <Cart />
      </div>
    </CartProvider>
  );
}

export default App;