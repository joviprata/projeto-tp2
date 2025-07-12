'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Lista {
  id: number;
  name: string;
  products: string[];
}

const listas: Lista[] = [
  {
    id: 1,
    name: 'Lista 1',
    products: ['P1', 'P2'],
  },
  {
    id: 2,
    name: 'Lista 2',
    products: ['P1', 'P2', 'P3'],
  },
  {
    id: 3,
    name: 'Lista 3',
    products: ['P1', 'P2', 'P3', 'P4'],
  },
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
  <svg
    className={styles.headerIcon}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    className={styles.headerIcon}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className={styles.searchIcon}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className={styles.searchIcon}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);
function App() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListas, setFilteredListas] = useState<Lista[]>(listas);
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
  const handleListClick = (id) => {
    // Salva no cookie id lista
    // GET \
    router.push(`/myLists/${id}`);
  };
  const handleSearch = () => {};
  return (
    <div className={styles.appContainer}>
      {/* Header */}
      <header
        className={styles.appHeader}
        style={{ position: 'relative', zIndex: 20 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerBrand}>
            <div className={styles.brandIcon} onClick={handleLogoClick}>
              <Logo />
            </div>
            <h1 className={styles.brandTitle} onClick={handleTitleClick}>
              Global Market
            </h1>
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
      {/* Search Section */}
      <div className={styles.searchContainer}>
        <div className={styles.searchCard}>
          <div className={styles.searchForm}>
            <div className={styles.searchInputGroup}>
              <input
                type="text"
                placeholder="Pesquisar Lista"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.searchButton} onClick={handleSearch}>
              <SearchIcon />
            </button>
            <button className={styles.searchButton}>
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>
      {/* Products Grid */}
      <div className={styles.productsContainer}>
        <div className={styles.productsGrid}>
          {filteredListas.map((list) => (
            <div
              key={list.id}
              className={styles.productCard}
              onClick={() => handleListClick(list.id)}
            >
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>{list.name}</h3>
              </div>

              <div className={styles.productBody}>
                {list.products.map((pi, id) => {
                  return <li key={id}>{pi}</li>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
