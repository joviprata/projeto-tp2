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
  pricesBySupermarket?: PriceBySupermarket[];
}

interface PriceBySupermarket {
  supermarket: {
    id: number;
    name: string;
    address?: string;
  };
  priceRecords: PriceRecord[];
}

interface PriceRecord {
  id: number;
  price: number;
  recordDate: string;
  available: boolean;
  verified: boolean;
  user: {
    id: number;
    name: string;
  };
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
  const [existingProductPreview, setExistingProductPreview] =
    useState<Product | null>(null);

  // Estados para o sistema de listas de compras
  const [showListModal, setShowListModal] = useState(false);
  const [selectedProductToAdd, setSelectedProductToAdd] =
    useState<Product | null>(null);
  const [userLists, setUserLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<string>('');
  const [newListName, setNewListName] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const [submittingToList, setSubmittingToList] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Definir userId padrão no localStorage se não existir
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', '2'); // Usar userId 2 como cliente padrão
    }
  }, []);

  // Carregar contagem de solicitações pendentes
  useEffect(() => {
    const loadPendingCount = () => {
      try {
        const allRequests = JSON.parse(
          localStorage.getItem('pendingPriceRequests') || '[]'
        );
        const userId = localStorage.getItem('userId') || '2';
        const userPendingRequests = allRequests.filter(
          (request: any) =>
            request.userId === parseInt(userId) && request.status === 'pending'
        );
        setPendingRequestsCount(userPendingRequests.length);
      } catch (err) {
        console.error('Erro ao carregar contagem de solicitações:', err);
      }
    };

    loadPendingCount();
    // Recarregar a contagem a cada 5 segundos para sincronizar
    const interval = setInterval(loadPendingCount, 5000);
    return () => clearInterval(interval);
  }, []);

  // Buscar produtos e supermercados do backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products/with-price-records');
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

    const fetchUserLists = async () => {
      try {
        const userId = localStorage.getItem('userId') || '2'; // Usar userId 2 para cliente
        const response = await api.get(`/product-lists/user/${userId}`);
        setUserLists(response.data.data || []);
      } catch (err) {
        console.error('Erro ao buscar listas do usuário:', err);
        setUserLists([]);
      }
    };

    fetchProducts();
    fetchSupermarkets();
    fetchUserLists();
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

  const AdminIcon = () => (
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
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const RequestsIcon = () => (
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
        d="M15 17h5l-5 5v-5zM9 8h6M9 12h6M9 16h3m-9-8V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
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
    console.log('Título clicado - está visível!');
    router.push('/homeCliente');
  };

  const handleUserClick = () => {
    router.push('/perfil');
  };

  const handleCartClick = () => {
    router.push('/myLists');
  };

  const handleAdminClick = () => {
    router.push('/admin/login');
  };

  const handleRequestsClick = () => {
    router.push('/requests');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddShopList = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProductToAdd(product);
      setShowListModal(true);
      setSelectedList('');
      setNewListName('');
      setProductQuantity(1);
      setIsCreatingNewList(false);
    }
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
    setExistingProductPreview(null);
    setShowNewProductModal(true);
  };

  const closeNewProductModal = () => {
    setShowNewProductModal(false);
    setSubmitting(false);
    setExistingProductPreview(null);
  };

  // Função para verificar se produto existe pelo código de barras
  const checkExistingProduct = async (barCode: string) => {
    if (barCode.length < 8) {
      setExistingProductPreview(null);
      return;
    }

    try {
      const searchResponse = await api.get('/products');
      const existingProduct = searchResponse.data.find(
        (product: Product) => product.barCode === barCode
      );

      if (existingProduct) {
        setExistingProductPreview(existingProduct);
        // Preencher automaticamente nome e descrição se encontrar produto
        setNewProduct((prev) => ({
          ...prev,
          name: existingProduct.name,
          variableDescription: existingProduct.variableDescription || '',
        }));
      } else {
        setExistingProductPreview(null);
      }
    } catch (err) {
      console.log('Erro ao verificar produto existente:', err);
      setExistingProductPreview(null);
    }
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

      // Buscar informações do supermercado e usuário para a solicitação
      const supermarket = supermarkets.find(
        (s) => s.id === parseInt(newProduct.supermarketId)
      );

      const userId = localStorage.getItem('userId') || '2';
      const userResponse = await api.get(`/users/${userId}`);
      const userName = userResponse.data.name || 'Usuário';

      // Criar solicitação pendente
      const request = {
        id: Date.now().toString(),
        productName: newProduct.name,
        barCode: newProduct.barCode,
        variableDescription: newProduct.variableDescription || '',
        price: parseFloat(
          newProduct.price.replace('R$', '').replace(',', '.').trim()
        ),
        supermarketId: parseInt(newProduct.supermarketId),
        supermarketName: supermarket?.name || 'Supermercado',
        userId: parseInt(userId),
        userName,
        requestDate: new Date().toISOString(),
        status: 'pending',
      };

      // Salvar no localStorage
      const existingRequests = JSON.parse(
        localStorage.getItem('pendingPriceRequests') || '[]'
      );
      existingRequests.push(request);
      localStorage.setItem(
        'pendingPriceRequests',
        JSON.stringify(existingRequests)
      );

      // Atualizar contagem de solicitações pendentes
      setPendingRequestsCount((prev) => prev + 1);

      closeNewProductModal();

      showNotification(
        'success',
        'Solicitação enviada!',
        'Sua solicitação foi enviada para aprovação do administrador. Você pode acompanhar o status na área de solicitações.'
      );
    } catch (err) {
      console.error('Erro ao criar solicitação:', err);
      showNotification(
        'error',
        'Erro ao enviar solicitação',
        'Erro ao enviar solicitação. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Funções do modal de listas de compras
  const closeListModal = () => {
    setShowListModal(false);
    setSelectedProductToAdd(null);
    setSelectedList('');
    setNewListName('');
    setProductQuantity(1);
    setIsCreatingNewList(false);
    setSubmittingToList(false);
  };

  const handleListSelectionChange = (value: string) => {
    if (value === 'new') {
      setIsCreatingNewList(true);
      setSelectedList('');
    } else {
      setIsCreatingNewList(false);
      setSelectedList(value);
    }
  };

  const handleAddToList = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductToAdd) return;

    try {
      setSubmittingToList(true);

      let listId = selectedList;

      // Se está criando uma nova lista
      if (isCreatingNewList) {
        if (!newListName.trim()) {
          showNotification(
            'error',
            'Nome da lista obrigatório',
            'Por favor, insira um nome para a nova lista.'
          );
          return;
        }

        const userId = localStorage.getItem('userId') || '2';
        const newListResponse = await api.post('/product-lists', {
          listName: newListName,
          userId: parseInt(userId),
        });

        listId = newListResponse.data.data.id.toString();

        // Atualizar a lista de listas do usuário
        const updatedListsResponse = await api.get(
          `/product-lists/user/${userId}`
        );
        setUserLists(updatedListsResponse.data.data || []);
      }

      if (!listId) {
        showNotification(
          'error',
          'Lista não selecionada',
          'Por favor, selecione uma lista ou crie uma nova.'
        );
        return;
      }

      // Adicionar produto à lista
      await api.post(`/product-lists/${listId}/items`, {
        productId: selectedProductToAdd.id,
        quantity: productQuantity,
      });

      closeListModal();

      const listName = isCreatingNewList
        ? newListName
        : userLists.find((list) => list.id.toString() === listId)?.listName ||
          'lista';

      showNotification(
        'success',
        'Produto adicionado!',
        `"${selectedProductToAdd.name}" foi adicionado à ${listName}.`
      );
    } catch (err) {
      console.error('Erro ao adicionar produto à lista:', err);
      showNotification(
        'error',
        'Erro ao adicionar produto',
        'Não foi possível adicionar o produto à lista. Tente novamente.'
      );
    } finally {
      setSubmittingToList(false);
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
            <h1
              className={styles.brandTitle}
              onClick={handleTitleClick}
              style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700' }}
            >
              Global Market
            </h1>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.headerButton} onClick={handleAdminClick}>
              <AdminIcon />
            </button>
            <button
              className={`${styles.headerButton} ${pendingRequestsCount > 0 ? styles.hasNotifications : ''}`}
              onClick={handleRequestsClick}
            >
              <RequestsIcon />
              {pendingRequestsCount > 0 && (
                <span className={styles.notificationBadge}>
                  {pendingRequestsCount}
                </span>
              )}
            </button>
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
              {existingProductPreview
                ? 'Solicitar Registro de Preço para Produto Existente'
                : 'Solicitar Novo Produto e Preço'}
            </div>
            <div className={styles['price-modal-content']}>
              {existingProductPreview && (
                <div className={styles['existing-product-info']}>
                  <p className={styles['existing-product-label']}>
                    Produto encontrado:
                  </p>
                  <p className={styles['existing-product-name']}>
                    {existingProductPreview.name}
                  </p>
                  <p className={styles['existing-product-description']}>
                    {existingProductPreview.variableDescription ||
                      'Sem descrição adicional'}
                  </p>
                </div>
              )}

              <label className={styles['price-modal-label']}>
                Código de barras *
              </label>
              <input
                className={styles['price-modal-input']}
                type="text"
                value={newProduct.barCode}
                onChange={(e) => {
                  const barCode = e.target.value;
                  setNewProduct({ ...newProduct, barCode });
                  checkExistingProduct(barCode);
                }}
                placeholder="Ex: 123456789012"
                required
              />

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
                disabled={!!existingProductPreview}
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
                disabled={!!existingProductPreview}
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
                  {submitting
                    ? 'Enviando...'
                    : existingProductPreview
                      ? 'Solicitar Registro de Preço'
                      : 'Solicitar Produto e Preço'}
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

      {/* Modal de Adicionar à Lista */}
      {showListModal && selectedProductToAdd && (
        <div className={styles['price-modal-overlay']}>
          <form
            className={styles['new-product-modal']}
            onSubmit={handleAddToList}
          >
            <div className={styles['price-modal-header']}>
              Adicionar à Lista de Compras
            </div>
            <div className={styles['price-modal-content']}>
              <div className={styles['existing-product-info']}>
                <p className={styles['existing-product-label']}>
                  Produto selecionado:
                </p>
                <p className={styles['existing-product-name']}>
                  {selectedProductToAdd.name}
                </p>
                <p className={styles['existing-product-description']}>
                  {selectedProductToAdd.variableDescription ||
                    'Sem descrição adicional'}
                </p>
              </div>

              <label className={styles['price-modal-label']}>
                Quantidade *
              </label>
              <input
                className={styles['price-modal-input']}
                type="number"
                min="1"
                value={productQuantity}
                onChange={(e) =>
                  setProductQuantity(parseInt(e.target.value) || 1)
                }
                required
              />

              <label className={styles['price-modal-label']}>
                Selecionar Lista *
              </label>
              <select
                className={styles['price-modal-input']}
                value={isCreatingNewList ? 'new' : selectedList}
                onChange={(e) => handleListSelectionChange(e.target.value)}
                required
              >
                <option value="">Selecione uma lista</option>
                {userLists.map((list) => (
                  <option key={list.id} value={list.id.toString()}>
                    {list.listName}
                  </option>
                ))}
                <option value="new">+ Criar nova lista</option>
              </select>

              {isCreatingNewList && (
                <>
                  <label className={styles['price-modal-label']}>
                    Nome da nova lista *
                  </label>
                  <input
                    className={styles['price-modal-input']}
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Ex: Compras da semana"
                    required
                  />
                </>
              )}

              <div className={styles['price-modal-actions']}>
                <button
                  type="submit"
                  className={styles['price-modal-btn']}
                  disabled={submittingToList}
                >
                  {submittingToList ? 'Adicionando...' : 'Adicionar à Lista'}
                </button>
                <button
                  type="button"
                  className={`${styles['price-modal-btn']} ${styles['cancel']}`}
                  onClick={closeListModal}
                  disabled={submittingToList}
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
              title="Solicitar novo produto e preço"
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

                    {/* Seção de preços por supermercado */}
                    {product.pricesBySupermarket &&
                      product.pricesBySupermarket.length > 0 && (
                        <div className={styles.pricesSection}>
                          <h4 className={styles.pricesTitle}>
                            Melhores preços (até 3):
                          </h4>
                          {product.pricesBySupermarket.map(
                            (supermarketGroup) => (
                              <div
                                key={supermarketGroup.supermarket.id}
                                className={styles.supermarketGroup}
                              >
                                <div className={styles.supermarketHeader}>
                                  <h5 className={styles.supermarketName}>
                                    {supermarketGroup.supermarket.name}
                                  </h5>
                                  {supermarketGroup.supermarket.address && (
                                    <p className={styles.supermarketAddress}>
                                      {supermarketGroup.supermarket.address}
                                    </p>
                                  )}
                                </div>
                                <div className={styles.priceRecords}>
                                  {supermarketGroup.priceRecords.map(
                                    (record) => (
                                      <div
                                        key={record.id}
                                        className={styles.priceRecord}
                                      >
                                        <div className={styles.priceInfo}>
                                          <span className={styles.price}>
                                            {formatPrice(Number(record.price))}
                                          </span>
                                          <span className={styles.priceDate}>
                                            {new Date(
                                              record.recordDate
                                            ).toLocaleDateString('pt-BR')}
                                          </span>
                                        </div>
                                        <div className={styles.priceStatus}>
                                          {record.verified && (
                                            <span className={styles.verified}>
                                              ✓ Verificado
                                            </span>
                                          )}
                                          {!record.available && (
                                            <span
                                              className={styles.unavailable}
                                            >
                                              Indisponível
                                            </span>
                                          )}
                                        </div>
                                        <span className={styles.priceUser}>
                                          por {record.user.name}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {(!product.pricesBySupermarket ||
                      product.pricesBySupermarket.length === 0) && (
                      <div className={styles.noPrices}>
                        <p>Nenhum preço registrado ainda.</p>
                      </div>
                    )}

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
