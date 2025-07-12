'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../../config/api';
import styles from '../page.module.css';

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
  product: Product;
}

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
  totalPrice: number;
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
}

const Logo = () => (
  <Image
    src="/Global_Market_Logo.png"
    width={100}
    height={100}
    alt="Logo"
    className={styles.logo}
  />
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

export default function ListaDetalhesPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lista, setLista] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  // Estados para modal de comparação de supermercados
  const [showSupermarketsModal, setShowSupermarketsModal] = useState(false);
  const [supermarketsData, setSupermarketsData] = useState<Supermarket[]>([]);

  // Estados para adicionar produtos
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);

  // Estados para editar e excluir lista
  const [showEditListModal, setShowEditListModal] = useState(false);
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [editListName, setEditListName] = useState('');
  const [updatingList, setUpdatingList] = useState(false);

  // Definir userId padrão no localStorage se não existir
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', '2'); // Usar userId 2 como cliente padrão
    }
  }, []);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId') || '2';

        // Buscar lista e produtos em paralelo
        const [listResponse, productsResponse] = await Promise.all([
          api.get(`/product-lists/user/${userId}`),
          api.get('/products'),
        ]);

        // Encontrar a lista específica pelo ID
        const allLists = listResponse.data.data || [];
        const specificList = allLists.find(
          (list) => list.id === parseInt(id as string)
        );

        if (specificList) {
          setLista(specificList);
          setError(null);
        } else {
          setError('Lista não encontrada.');
        }

        // Carregar produtos para adicionar à lista
        setAllProducts(productsResponse.data || []);
      } catch (err) {
        console.error('Erro ao buscar detalhes da lista:', err);
        setError('Erro ao carregar lista. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListDetails();
    }
  }, [id]);

  const showNotification = (
    type: 'success' | 'error',
    title: string,
    message: string
  ) => {
    const notificationId = Date.now().toString();
    const newNotification: Notification = {
      id: notificationId,
      type,
      title,
      message,
    };

    setNotifications((prev) => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(notificationId);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const toggleItemTaken = async (productId: number, currentStatus: boolean) => {
    try {
      setUpdatingItem(productId);

      await api.put(`/product-lists/${id}/items/${productId}`, {
        isTaken: !currentStatus,
      });

      // Atualizar estado local
      setLista((prevLista) => {
        if (!prevLista) return null;

        return {
          ...prevLista,
          items: prevLista.items?.map((item) =>
            item.productId === productId
              ? { ...item, isTaken: !currentStatus }
              : item
          ),
        };
      });

      showNotification(
        'success',
        'Item atualizado!',
        `Item marcado como ${!currentStatus ? 'coletado' : 'não coletado'}.`
      );
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
      showNotification(
        'error',
        'Erro ao atualizar',
        'Não foi possível atualizar o item. Tente novamente.'
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const findCheapestSupermarket = async () => {
    try {
      const response = await api.get(`/supermarkets/cheapest/${id}`);
      const result = response.data;

      if (result.supermarkets && result.supermarkets.length > 0) {
        // Ordenar supermercados por preço (menor para maior)
        const sortedSupermarkets = result.supermarkets.sort(
          (a, b) => a.totalPrice - b.totalPrice
        );

        setSupermarketsData(sortedSupermarkets);
        setShowSupermarketsModal(true);
      } else {
        showNotification(
          'error',
          'Nenhum supermercado encontrado',
          'Não foi possível encontrar supermercados com os produtos desta lista.'
        );
      }
    } catch (err) {
      console.error('Erro ao buscar supermercado mais barato:', err);
      showNotification(
        'error',
        'Erro na busca',
        'Não foi possível encontrar o supermercado mais barato. Tente novamente.'
      );
    }
  };

  const addProductToList = async () => {
    if (!selectedProduct) {
      showNotification('error', 'Erro', 'Selecione um produto.');
      return;
    }

    try {
      await api.post(`/product-lists/${id}/items`, {
        productId: selectedProduct.id,
        quantity: productQuantity,
      });

      // Recarregar a lista
      const userId = localStorage.getItem('userId') || '2';
      const listResponse = await api.get(`/product-lists/user/${userId}`);
      const allLists = listResponse.data.data || [];
      const updatedList = allLists.find(
        (list) => list.id === parseInt(id as string)
      );

      if (updatedList) {
        setLista(updatedList);
      }

      setShowAddProductModal(false);
      setSelectedProduct(null);
      setProductQuantity(1);
      setSearchProduct('');

      showNotification(
        'success',
        'Produto adicionado!',
        `${selectedProduct.name} foi adicionado à lista.`
      );
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      showNotification(
        'error',
        'Erro',
        'Não foi possível adicionar o produto. Tente novamente.'
      );
    }
  };

  const removeProductFromList = async (productId: number) => {
    try {
      await api.delete(`/product-lists/${id}/items/${productId}`);

      // Atualizar estado local
      setLista((prevLista) => {
        if (!prevLista) return null;

        return {
          ...prevLista,
          items: prevLista.items?.filter(
            (item) => item.productId !== productId
          ),
        };
      });

      showNotification(
        'success',
        'Produto removido!',
        'O produto foi removido da lista.'
      );
    } catch (err) {
      console.error('Erro ao remover produto:', err);
      showNotification(
        'error',
        'Erro',
        'Não foi possível remover o produto. Tente novamente.'
      );
    }
  };

  const updateProductQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      await api.put(`/product-lists/${id}/items/${productId}`, {
        quantity: newQuantity,
      });

      // Atualizar estado local
      setLista((prevLista) => {
        if (!prevLista) return null;

        return {
          ...prevLista,
          items: prevLista.items?.map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          ),
        };
      });

      showNotification(
        'success',
        'Quantidade atualizada!',
        `Quantidade do produto alterada para ${newQuantity}.`
      );
    } catch (err) {
      console.error('Erro ao atualizar quantidade:', err);
      showNotification(
        'error',
        'Erro',
        'Não foi possível atualizar a quantidade. Tente novamente.'
      );
    }
  };

  const editList = async () => {
    if (!editListName.trim()) {
      showNotification('error', 'Erro', 'Nome da lista é obrigatório.');
      return;
    }

    try {
      setUpdatingList(true);

      await api.put(`/product-lists/${id}`, {
        listName: editListName,
      });

      // Atualizar estado local
      setLista((prevLista) => {
        if (!prevLista) return null;
        return {
          ...prevLista,
          listName: editListName,
        };
      });

      setShowEditListModal(false);
      setEditListName('');

      showNotification(
        'success',
        'Lista atualizada!',
        'O nome da lista foi alterado com sucesso.'
      );
    } catch (err) {
      console.error('Erro ao atualizar lista:', err);
      showNotification(
        'error',
        'Erro',
        'Não foi possível atualizar a lista. Tente novamente.'
      );
    } finally {
      setUpdatingList(false);
    }
  };

  const deleteList = async () => {
    try {
      setUpdatingList(true);

      await api.delete(`/product-lists/${id}`);

      showNotification(
        'success',
        'Lista excluída!',
        'A lista foi excluída com sucesso.'
      );

      // Redirecionar para a página de listas após um breve delay
      setTimeout(() => {
        router.push('/myLists');
      }, 1500);
    } catch (err) {
      console.error('Erro ao excluir lista:', err);
      showNotification(
        'error',
        'Erro',
        'Não foi possível excluir a lista. Tente novamente.'
      );
      setUpdatingList(false);
    }
  };

  const openEditModal = () => {
    setEditListName(lista?.listName || '');
    setShowEditListModal(true);
  };

  if (loading) {
    return (
      <div className={styles.appContainer}>
        <div className={styles.loadingContainer}>
          <p>Carregando lista...</p>
        </div>
      </div>
    );
  }

  if (error || !lista) {
    return (
      <div className={styles.appContainer}>
        <div className={styles.errorContainer}>
          <p>{error || 'Lista não encontrada'}</p>
          <button
            onClick={() => router.push('/myLists')}
            className={styles.retryButton}
          >
            Voltar às listas
          </button>
        </div>
      </div>
    );
  }

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

      {/* Modal de Comparação de Supermercados */}
      {showSupermarketsModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowSupermarketsModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>📊 Comparação de Preços</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowSupermarketsModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className={styles.modalBody}>
              {supermarketsData.length > 0 && (
                <div className={styles.supermarketsList}>
                  {supermarketsData.map((supermarket, index) => (
                    <div
                      key={supermarket.id}
                      className={`${styles.supermarketItem} ${index === 0 ? styles.cheapest : ''}`}
                    >
                      <div className={styles.supermarketRank}>
                        {index === 0
                          ? '🥇'
                          : index === 1
                            ? '🥈'
                            : index === 2
                              ? '🥉'
                              : `${index + 1}º`}
                      </div>
                      <div className={styles.supermarketInfo}>
                        <h3>{supermarket.name}</h3>
                        <p className={styles.supermarketPrice}>
                          R$ {supermarket.totalPrice.toFixed(2)}
                        </p>
                        {index > 0 && (
                          <p className={styles.priceDifference}>
                            +R${' '}
                            {(
                              supermarket.totalPrice -
                              supermarketsData[0].totalPrice
                            ).toFixed(2)}{' '}
                            que o mais barato
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {supermarketsData.length > 1 && (
                <div className={styles.savingsInfo}>
                  <p>
                    💰 Economia de{' '}
                    <strong>
                      R${' '}
                      {(
                        supermarketsData[1].totalPrice -
                        supermarketsData[0].totalPrice
                      ).toFixed(2)}
                    </strong>{' '}
                    escolhendo o {supermarketsData[0].name}
                  </p>
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButton}
                onClick={() => setShowSupermarketsModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Produto */}
      {showAddProductModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAddProductModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>➕ Adicionar Produto à Lista</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowAddProductModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.searchProductContainer}>
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className={styles.searchProductInput}
                />
              </div>

              <div className={styles.productsList}>
                {allProducts
                  .filter(
                    (product) =>
                      product.name
                        .toLowerCase()
                        .includes(searchProduct.toLowerCase()) ||
                      product.barCode.includes(searchProduct)
                  )
                  .slice(0, 10) // Limitar a 10 resultados
                  .map((product) => (
                    <div
                      key={product.id}
                      className={`${styles.productOption} ${
                        selectedProduct?.id === product.id
                          ? styles.selected
                          : ''
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className={styles.productInfo}>
                        <h4>{product.name}</h4>
                        <p>{product.variableDescription || 'Sem descrição'}</p>
                        <p className={styles.productBarcode}>
                          Código: {product.barCode}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {selectedProduct && (
                <div className={styles.quantityContainer}>
                  <label htmlFor="quantity">Quantidade:</label>
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() =>
                        setProductQuantity(Math.max(1, productQuantity - 1))
                      }
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={productQuantity}
                      onChange={(e) =>
                        setProductQuantity(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className={styles.quantityInput}
                      min="1"
                    />
                    <button
                      onClick={() => setProductQuantity(productQuantity + 1)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowAddProductModal(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.modalButton}
                onClick={addProductToList}
                disabled={!selectedProduct}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Lista */}
      {showEditListModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowEditListModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>✏️ Editar Lista</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowEditListModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.editListContainer}>
                <label htmlFor="editListName">Nome da Lista:</label>
                <input
                  type="text"
                  id="editListName"
                  value={editListName}
                  onChange={(e) => setEditListName(e.target.value)}
                  className={styles.editListInput}
                  placeholder="Digite o novo nome da lista"
                  disabled={updatingList}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowEditListModal(false)}
                disabled={updatingList}
              >
                Cancelar
              </button>
              <button
                className={styles.modalButton}
                onClick={editList}
                disabled={!editListName.trim() || updatingList}
              >
                {updatingList ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmar Exclusão */}
      {showDeleteListModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDeleteListModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>🗑️ Excluir Lista</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowDeleteListModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.deleteConfirmContainer}>
                <p>
                  Tem certeza que deseja excluir a lista{' '}
                  <strong>"{lista?.listName}"</strong>?
                </p>
                <p className={styles.deleteWarning}>
                  ⚠️ Esta ação não pode ser desfeita. Todos os produtos da lista
                  serão removidos.
                </p>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowDeleteListModal(false)}
                disabled={updatingList}
              >
                Cancelar
              </button>
              <button
                className={styles.deleteButton}
                onClick={deleteList}
                disabled={updatingList}
              >
                {updatingList ? 'Excluindo...' : 'Excluir Lista'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerBrand}>
            <div
              className={styles.brandIcon}
              onClick={() => router.push('/homeCliente')}
            >
              <Logo />
            </div>
            <h1
              className={styles.brandTitle}
              onClick={() => router.push('/homeCliente')}
            >
              Global Market
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={styles.productsContainer}>
        <div className={styles.listDetailsHeader}>
          <h1 className={styles.listTitle}>{lista.listName}</h1>
          <p className={styles.listInfo}>
            Criada em:{' '}
            {new Date(lista.creationDate).toLocaleDateString('pt-BR')}
          </p>
          <div className={styles.listActions}>
            <button
              onClick={() => router.push('/myLists')}
              className={styles.backButton}
            >
              ← Voltar às listas
            </button>
            <button onClick={openEditModal} className={styles.editListButton}>
              ✏️ Editar lista
            </button>
            <button
              onClick={() => setShowDeleteListModal(true)}
              className={styles.deleteListButton}
            >
              🗑️ Excluir lista
            </button>
            <button
              onClick={() => setShowAddProductModal(true)}
              className={styles.addProductButton}
            >
              ➕ Adicionar produto
            </button>
            <button
              onClick={findCheapestSupermarket}
              className={styles.findCheapestButton}
            >
              🏪 Comparar preços
            </button>
          </div>
        </div>

        <div className={styles.listItemsContainer}>
          <h3 className={styles.itemsTitle}>
            Produtos ({lista.items?.length || 0} itens)
          </h3>

          {!lista.items || lista.items.length === 0 ? (
            <div className={styles.noProductsContainer}>
              <p>Esta lista ainda não possui produtos.</p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className={styles.addProductsButton}
              >
                Adicionar produtos
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {lista.items.map((item) => (
                <div
                  key={item.productId}
                  className={`${styles.listItem} ${item.isTaken ? styles.itemTaken : ''}`}
                >
                  <div className={styles.itemContent}>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{item.product.name}</h4>
                      <p className={styles.itemDescription}>
                        {item.product.variableDescription ||
                          'Sem descrição adicional'}
                      </p>
                      <p className={styles.itemBarcode}>
                        Código: {item.product.barCode}
                      </p>
                    </div>
                    <div className={styles.itemQuantityContainer}>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() =>
                            updateProductQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className={styles.quantityButton}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className={styles.itemQuantity}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateProductQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      onClick={() =>
                        toggleItemTaken(item.productId, item.isTaken)
                      }
                      disabled={updatingItem === item.productId}
                      className={`${styles.toggleButton} ${item.isTaken ? styles.unmarkButton : styles.markButton}`}
                    >
                      {updatingItem === item.productId
                        ? '...'
                        : item.isTaken
                          ? '✓ Coletado'
                          : 'Marcar como coletado'}
                    </button>
                    <button
                      onClick={() => removeProductFromList(item.productId)}
                      className={styles.removeButton}
                    >
                      🗑️ Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
