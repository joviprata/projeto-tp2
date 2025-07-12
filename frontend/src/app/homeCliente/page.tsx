'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '../../config/api';
import styles from './page.module.css';

interface Product {
  id: number;
  name: string;
  barCode: string;
  variableDescription?: string;
  createdAt: string;
}

interface Supermarket {
  id: number;
  name: string;
  address?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
}

function App() {
  const router = useRouter();
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado do modal de preço
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('R$ 1000,00');

  // Estado do modal de novo produto/preço
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    barCode: '',
    variableDescription: '',
    price: '',
    supermarketId: '',
    userId: 1, // Por enquanto hardcoded, depois implementar autenticação
  });
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Buscar produtos e supermercados do backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSupermarkets = async () => {
      try {
        const response = await api.get('/supermarkets');
        console.log('Resposta da API supermercados:', response.data);
        const supermarketsData = response.data.supermarkets || response.data;
        console.log('Dados dos supermercados:', supermarketsData);
        const finalData = Array.isArray(supermarketsData)
          ? supermarketsData
          : [];
        console.log('Dados finais dos supermercados:', finalData);
        setSupermarkets(finalData);
      } catch (err) {
        console.error('Erro ao buscar supermercados:', err);
        setSupermarkets([]); // Em caso de erro, definir array vazio
      }
    };

    fetchProducts();
    fetchSupermarkets();
  }, []);

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
      className={styles.plusIcon}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
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
      className={`${styles.notificationIcon} ${styles.success}`}
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
      className={`${styles.notificationIcon} ${styles.error}`}
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddShopList = (productId: number) => {
    console.log(`Adding product ${productId} to cart`);
  };

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

  // Funções do modal de preço original
  const openPriceModal = (id: number, name: string) => {
    setShowPriceModal(true);
  };

  const closePriceModal = () => setShowPriceModal(false);

  const handleSolicitarAlteracao = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPriceModal(false);
  };

  // Funções do modal de novo produto
  const openNewProductModal = () => {
    setNewProduct({
      name: '',
      barCode: '',
      variableDescription: '',
      price: '',
      supermarketId: '',
      userId: 1,
    });
    setShowNewProductModal(true);
  };

  const closeNewProductModal = () => {
    setShowNewProductModal(false);
    setSubmitting(false);
  };

  const handleCreateProductAndPrice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.barCode ||
      !newProduct.price ||
      !newProduct.supermarketId
    ) {
      showNotification(
        'error',
        'Campos obrigatórios',
        'Por favor, preencha todos os campos obrigatórios.'
      );
      return;
    }

    try {
      setSubmitting(true);

      // Primeiro, criar o produto
      const productResponse = await api.post('/products', {
        name: newProduct.name,
        barCode: newProduct.barCode,
        variableDescription: newProduct.variableDescription || undefined,
      });

      const createdProduct = productResponse.data;

      // Depois, criar o registro de preço
      await api.post('/price-records', {
        price: parseFloat(
          newProduct.price.replace('R$', '').replace(',', '.').trim()
        ),
        productId: createdProduct.id,
        supermarketId: parseInt(newProduct.supermarketId),
        userId: newProduct.userId,
        available: true,
        verified: false,
      });

      // Atualizar a lista de produtos
      const updatedProducts = await api.get('/products');
      setProducts(updatedProducts.data);

      closeNewProductModal();
      showNotification(
        'success',
        'Produto criado!',
        'Produto e registro de preço criados com sucesso!'
      );
    } catch (err) {
      console.error('Erro ao criar produto e preço:', err);
      showNotification(
        'error',
        'Erro ao criar produto',
        'Erro ao criar produto e preço. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
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

      {/* Modal de Preço Original */}
      {showPriceModal && (
        <div className={styles['price-modal-overlay']}>
          <form
            className={styles['price-modal']}
            onSubmit={handleSolicitarAlteracao}
          >
            <div className={styles['price-modal-header']}>
              Insira o novo preço:
            </div>
            <div className={styles['price-modal-content']}>
              <label className={styles['price-modal-label']}>
                Nome do produto
              </label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="R$ 1000,00"
                required
              />
              <div className={styles['price-modal-actions']}>
                <button type="submit" className={styles['price-modal-btn']}>
                  Solicitar alteração
                </button>
                <button
                  type="button"
                  className={`${styles['price-modal-btn']} ${styles['cancel']}`}
                  onClick={closePriceModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Novo Produto */}
      {showNewProductModal && (
        <div className={styles['price-modal-overlay']}>
          <form
            className={styles['new-product-modal']}
            onSubmit={handleCreateProductAndPrice}
          >
            <div className={styles['price-modal-header']}>
              Adicionar Novo Produto e Preço
            </div>
            <div className={styles['price-modal-content']}>
              <label className={styles['price-modal-label']}>
                Nome do produto *
              </label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Ex: Leite Integral"
                required
              />

              <label className={styles['price-modal-label']}>
                Código de barras *
              </label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={newProduct.barCode}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, barCode: e.target.value })
                }
                placeholder="Ex: 123456789012"
                required
              />

              <label className={styles['price-modal-label']}>
                Descrição adicional
              </label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={newProduct.variableDescription}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    variableDescription: e.target.value,
                  })
                }
                placeholder="Ex: 1L, 500g, etc."
              />

              <label className={styles['price-modal-label']}>Preço *</label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                placeholder="Ex: 5.99"
                required
              />

              <label className={styles['price-modal-label']}>
                Supermercado *
              </label>
              <select
                className={styles['price-modal-input']}
                value={newProduct.supermarketId}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    supermarketId: e.target.value,
                  })
                }
                required
              >
                <option value="">Selecione um supermercado</option>
                {Array.isArray(supermarkets) &&
                  supermarkets.map((supermarket) => (
                    <option key={supermarket.id} value={supermarket.id}>
                      {supermarket.name}
                    </option>
                  ))}
              </select>

              <div className={styles['price-modal-actions']}>
                <button
                  type="submit"
                  className={styles['price-modal-btn']}
                  disabled={submitting}
                >
                  {submitting ? 'Criando...' : 'Criar Produto e Preço'}
                </button>
                <button
                  type="button"
                  className={`${styles['price-modal-btn']} ${styles['cancel']}`}
                  onClick={closeNewProductModal}
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
                placeholder="Pesquisar Produto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.searchButton}>
              <SearchIcon />
            </button>
            <button
              className={styles.addButton}
              onClick={openNewProductModal}
              title="Adicionar novo produto e preço"
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.productsContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Carregando produtos...</p>
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
            {products
              .filter(
                (product) =>
                  product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  (product.variableDescription &&
                    product.variableDescription
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()))
              )
              .map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productHeader}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                  </div>

                  <div className={styles.productBody}>
                    <p className={styles.productDescription}>
                      {product.variableDescription ||
                        'Produto sem descrição adicional'}
                    </p>

                    <div className={styles.productInfo}>
                      <p className={styles.productBarcode}>
                        <strong>Código:</strong> {product.barCode}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddShopList(product.id)}
                      className={styles.addToCartButton}
                    >
                      Adicionar a sua lista de compras
                    </button>
                  </div>
                </div>
              ))}
            {products.filter(
              (product) =>
                product.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                (product.variableDescription &&
                  product.variableDescription
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
            ).length === 0 &&
              !loading && (
                <div className={styles.noProductsContainer}>
                  <p>Nenhum produto encontrado.</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
