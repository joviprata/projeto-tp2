'use client'
import React, { useState, useEffect } from 'react';
import { ShoppingCartIcon, UserIcon, CartIcon, SearchIcon, PlusIcon, MinusIcon, XIcon } from '../components/Icons';
import './page.css';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity?: number;
}

interface CartItem extends Product {
  quantity: number;
}

// Mock API functions
const fetchCartProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Produto 1', price: 1000 },
        { id: 2, name: 'Produto 2', price: 2000 },
        { id: 3, name: 'Produto 3', price: 3000 },
        { id: 4, name: 'Produto 4', price: 4000 },
      ]);
    }, 500);
  });
};

const fetchRelatedProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 5, name: 'Produto 1', price: 1000 },
        { id: 6, name: 'Produto 2', price: 1000 },
        { id: 7, name: 'Produto 3', price: 1000 },
        { id: 8, name: 'Produto 4', price: 1000 },
      ]);
    }, 300);
  });
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartData, relatedData] = await Promise.all([
          fetchCartProducts(),
          fetchRelatedProducts(),
        ]);
        
        const cartItemsWithQuantity = cartData.map(product => ({
          ...product,
          quantity: 1,
        }));
        
        setCartItems(cartItemsWithQuantity);
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, 1);
    } else {
      setCartItems(prevItems => [...prevItems, { ...product, quantity: 1 }]);
    }
  };

  const handleCheckout = () => {
    alert(`Finalizando compra no valor de ${formatCurrency(cartTotal)}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <ShoppingCartIcon />
            <h1 className="logo-text">Global Market</h1>
          </div>
          
          <div className="header-icons">
            <button className="icon-button">
              <UserIcon />
            </button>
            <button className="icon-button">
              <CartIcon />
            </button>
            <button className="icon-button">
              <SearchIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="shopping-container">
          <h2 className="section-title">Lista de Compras</h2>
          
          <div className="shopping-layout">
            {/* Cart Section */}
            <div className="cart-section">
              <div className="cart-items">
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <p>Seu carrinho está vazio</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">{formatCurrency(item.price)}</span>
                      </div>
                      
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <MinusIcon />
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <PlusIcon />
                          </button>
                        </div>
                        
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <XIcon />
                          REMOVER
                        </button>
                        
                        <button
                          className="add-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <PlusIcon />
                          ADICIONAR
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="cart-footer">
                <div className="total-section">
                  <span className="total-label">Total: {formatCurrency(cartTotal)}</span>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    FECHAR COMPRA!
                  </button>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            <div className="related-section">
              <h3 className="related-title">Produtos Relacionados</h3>
              
              <div className="related-products">
                {relatedProducts.map(product => (
                  <div key={product.id} className="related-item">
                    <div className="related-info">
                      <span className="related-name">{product.name}</span>
                      <span className="related-price">{formatCurrency(product.price)}</span>
                    </div>
                    
                    <button
                      className="related-add-btn"
                      onClick={() => addToCart(product)}
                    >
                      <PlusIcon />
                      ADICIONAR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;