'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  marketName: string;
  loc: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  },
  {
    id: 2,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  },
  {
    id: 3,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  },
  {
    id: 4,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  },
  {
    id: 5,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  },
  {
    id: 6,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  },
  {
    id: 7,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  },
  {
    id: 8,
    name: "Nome Produto 123",
    description: "Descrição do produto descrição do produto descrição do produto descrição do produto descr...",
    price: 1000.00,
    marketName: "Nome do Mercado",
    loc: "Ceilondres"
  }
];
// Logo component
const Logo = () => (
  <Image
    src="/Global_Market_Logo.png"
    width={100}
    height={100}
    alt="Logo"
    className={styles.logo}
  />
);

const UserIcon = () => (
  <svg className={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CartIcon = () => (
  <svg className={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

function App() {
  const router = useRouter();
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

    // Estado do modal de preço
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('R$ 1000,00');


  const handleLogoClick = () => {
    router.push('/homeCliente');
  };

  const handleTitleClick = () => {
    router.push('/homeCliente');
  };

  const handleUserClick = () => {
    router.push('/perfil');
  };

  const handleCartClick = () => {
    router.push('/shopCart');
  };
  const handlePopUp = () => {
    this.showPriceModal = true;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = (productId: number) => {
    console.log(`Adding product ${productId} to cart`);
  };

    // Funções do modal
  const openPriceModal = (id, name) => {
    setShowPriceModal(true);
  }
  const closePriceModal = () => setShowPriceModal(false);
  const handleSolicitarAlteracao = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar lógica para enviar a alteração
    setShowPriceModal(false);
  };

  return (
    <div className={styles.appContainer}>
      {/* Header */}
      <header className={styles.appHeader} style={{ position: 'relative', zIndex: 20 }}>
        <div className={styles.headerContent}>
          <div className={styles.headerBrand}>
            <div className={styles.brandIcon} onClick={handleLogoClick}>
              <Logo />
            </div>
            <h1 className={styles.brandTitle} onClick={handleTitleClick}>Global Market</h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.headerButton} onClick={handleUserClick}>
              <UserIcon />
            </button>
            <button className={styles.headerButton} onClick={handleCartClick}>
              <CartIcon />
            </button>
          </div>
        </div>
      </header>
      {/* Overlay e Modal de Preço */}
      {showPriceModal && (
        <div className={styles['price-modal-overlay']}>
          <form className={styles['price-modal']} onSubmit={handleSolicitarAlteracao}>
            <div className={styles['price-modal-header']}>
              Insira o novo preço:
            </div>
            <div className={styles['price-modal-content']}>
              {/* MUDAR NOME DO PRODUT */}
              <label className={styles['price-modal-label']}>Nome do produto</label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={productPrice}
                onChange={e => setProductPrice(e.target.value)}
                placeholder="R$ 1000,00"
                required
              />
              <div className={styles['price-modal-actions']}>
                <button type="submit" className={styles['price-modal-btn']}>
                  Solicitar alteração
                </button>
                <button type="button" className={`${styles['price-modal-btn']} ${styles['cancel']}`} onClick={closePriceModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search Section */}
      <div className={styles.searchContainer}>
        <div className={styles.searchCard}>
          <div className={styles.searchForm}>
            <div className={styles.searchInputGroup}>
              <input
                type="text"
                placeholder="Filtrar por Preço"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.searchInputGroup}>
              <input
                type="text"
                placeholder="Pesquisar Produto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.searchButton}>
              <SearchIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.productsContainer}>
        <div className={styles.productsGrid}>
          {mockProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>{product.name}</h3>
              </div>

              <div className={styles.productBody}>
                <p className={styles.productDescription}>
                  {product.description}
                </p>
                
                <p className={styles.productDescription}>
                  Localização: {product.loc}
                </p>
                
                <div className={styles.productInfo}>
                  <span className={styles.productMarket}>{product.marketName}</span>
                  <span className={styles.productPrice}>
                    {formatPrice(product.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  className={styles.addToCartButton}
                >
                  Adicionar ao carrinho
                </button>

                <p className={styles.productDescription}>
                  O preço não é esse?{' '}
                  <a onClick={openPriceModal}>
                    <u>Clique aqui</u>
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;