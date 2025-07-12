'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '../../config/api';
import styles from './page.module.css';

interface ShoppingList {
  id: number;
  listName: string;
  creationDate: string;
  userId: number;
  items?: ListItem[];
}

interface ListItem {
  listId: number;
  productId: number;
  quantity: number;
  isTaken: boolean;
  product?: Product;
}

interface Product {
  id: number;
  name: string;
  barCode: string;
  variableDescription?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
}
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

const CheckIcon = () => (
  <svg
    className={styles.notificationIcon}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className={styles.notificationIcon}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
function App() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLists, setUserLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Definir userId padrão no localStorage se não existir
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', '2'); // Usar userId 2 como cliente padrão
    }
  }, []);

  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId') || '2'; // Fallback para userId 2
        const response = await api.get(`/product-lists/user/${userId}`);
        setUserLists(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar listas:', err);
        setError('Erro ao carregar listas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserLists();
  }, []);

  // Sistema de notificações
  const showNotification = (
    type: 'success' | 'error',
    title: string,
    message: string
  ) => {
    const id = Date.now().toString();
    const newNotification: Notification = { id, type, title, message };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newListName.trim()) {
      showNotification(
        'error',
        'Nome obrigatório',
        'Por favor, insira um nome para a lista.'
      );
      return;
    }

    try {
      setSubmitting(true);
      const userId = localStorage.getItem('userId') || '2';

      const response = await api.post('/product-lists', {
        userId: parseInt(userId),
        listName: newListName,
      });

      // Atualizar a lista de listas
      setUserLists((prev) => [...prev, response.data.data]);
      setNewListName('');
      setShowNewListModal(false);

      showNotification(
        'success',
        'Lista criada!',
        'Nova lista de compras criada com sucesso.'
      );
    } catch (err) {
      console.error('Erro ao criar lista:', err);
      showNotification(
        'error',
        'Erro ao criar lista',
        'Erro ao criar lista. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openNewListModal = () => {
    setNewListName('');
    setShowNewListModal(true);
  };

  const closeNewListModal = () => {
    setShowNewListModal(false);
    setSubmitting(false);
  };

  const filteredLists = userLists.filter((list) =>
    list.listName.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
    router.push('/myLists');
  };

  const handleListClick = (id: number) => {
    router.push(`/myLists/${id}`);
  };

  const handleSearch = () => {
    // A busca já é feita automaticamente através do filteredLists
  };
  return (
    <div className={styles.appContainer}>
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className={styles.notificationContainer}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notification} ${styles[notification.type]} ${styles.show}`}
            >
              {notification.type === 'success' ? <CheckIcon /> : <ErrorIcon />}
              <div className={styles.notificationContent}>
                <h4 className={styles.notificationTitle}>
                  {notification.title}
                </h4>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
              </div>
              <button
                className={styles.notificationClose}
                onClick={() => removeNotification(notification.id)}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}

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

      {/* Modal de Nova Lista */}
      {showNewListModal && (
        <div className={styles['price-modal-overlay']}>
          <form
            className={styles['new-product-modal']}
            onSubmit={handleCreateList}
          >
            <div className={styles['price-modal-header']}>Criar Nova Lista</div>
            <div className={styles['price-modal-content']}>
              <label className={styles['price-modal-label']}>
                Nome da lista *
              </label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Ex: Compras da semana"
                required
              />

              <div className={styles['price-modal-actions']}>
                <button
                  type="submit"
                  className={styles['price-modal-btn']}
                  disabled={submitting}
                >
                  {submitting ? 'Criando...' : 'Criar Lista'}
                </button>
                <button
                  type="button"
                  className={`${styles['price-modal-btn']} ${styles['cancel']}`}
                  onClick={closeNewListModal}
                  disabled={submitting}
                >
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
                placeholder="Pesquisar Lista"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.searchButton} onClick={handleSearch}>
              <SearchIcon />
            </button>
            <button className={styles.searchButton} onClick={openNewListModal}>
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Lists Grid */}
      <div className={styles.productsContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Carregando listas...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredLists.map((list) => (
              <div
                key={list.id}
                className={styles.productCard}
                onClick={() => handleListClick(list.id)}
              >
                <div className={styles.productHeader}>
                  <h3 className={styles.productTitle}>{list.listName}</h3>
                </div>

                <div className={styles.productBody}>
                  <p className={styles.productDescription}>
                    Criada em:{' '}
                    {new Date(list.creationDate).toLocaleDateString('pt-BR')}
                  </p>
                  <div className={styles.productInfo}>
                    <p className={styles.productBarcode}>
                      <strong>Itens:</strong> {list.items?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredLists.length === 0 && !loading && (
              <div className={styles.noProductsContainer}>
                <p>Nenhuma lista encontrada.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
