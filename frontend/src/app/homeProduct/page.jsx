/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import api from '../../config/api'; // Importa a instância do axios configurada

function UserIcon({ className }) {
  return (
    <svg
      className={className}
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
}

UserIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

function PlusIcon({ className }) {
  return (
    <svg
      className={className}
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
}

PlusIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

function XIcon({ className }) {
  return (
    <svg
      className={className}
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
}

XIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

// Função de busca de dados isolada para ser chamada sob demanda
async function fetchSupermarketAndProductsData({
  setLoading,
  setMessage,
  setMessageType,
  setProducts,
  setSupermarketId,
  router,
}) {
  setLoading(true);
  setMessage('');
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  if (!userId || role !== 'GERENTE') {
    setMessage('Acesso não autorizado. Faça login como gerente.');
    setMessageType('error');
    setLoading(false);
    router.push('/login');
    return;
  }

  try {
    const supermarketResponse = await api.get(
      `/supermarkets/byManager/${userId}`
    );
    const fetchedSupermarketId = supermarketResponse.data.id;
    setSupermarketId(fetchedSupermarketId);

    const priceRecordsResponse = await api.get(
      `/price-records/supermarket/${fetchedSupermarketId}`
    );
    const fetchedPriceRecords = priceRecordsResponse.data;

    const formattedProducts = fetchedPriceRecords.map((record) => ({
      id: record.productId,
      priceRecordId: record.id,
      name: record.product.name,
      description: record.product.variableDescription,
      price: record.price,
      barCode: record.product.barCode,
    }));

    setProducts(formattedProducts);
    setMessage('Produtos carregados com sucesso!');
    setMessageType('success');
  } catch (error) {
    if (error.response.status === 404) {
      setMessage('Supermercado não encontrado ou sem produtos.');
    } else if (error.code === 'ERR_NETWORK') {
      setMessage('Erro de conexão. Verifique se o backend está rodando.');
    } else {
      setMessage('Erro ao carregar produtos.');
    }
    setMessageType('error');
  } finally {
    setLoading(false);
  }
}

export default function Produtos() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supermarketId, setSupermarketId] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductData, setCurrentProductData] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Função para recarregar os produtos
  const refreshProducts = () => {
    fetchSupermarketAndProductsData({
      setLoading,
      setMessage,
      setMessageType,
      setProducts,
      setSupermarketId,
      router,
    });
  };

  useEffect(() => {
    // Chama a função de busca no carregamento inicial
    refreshProducts();
  }, [router]); // `router` é uma dependência para garantir que se o objeto router mudar, o efeito seja reexecutado.

  const handleEditarSupermarket = () => {
    router.push('/perfilMercado');
  };

  const handleAddProductClick = () => {
    setIsEditing(false);
    setCurrentProductData({});
    setShowAddEditModal(true);
  };

  const handleEditProductClick = (product) => {
    setIsEditing(true);
    setCurrentProductData({
      id: product.id,
      priceRecordId: product.priceRecordId,
      name: product.name,
      barCode: product.barCode,
      variableDescription: product.description,
      price: product.price,
    });
    setShowAddEditModal(true);
  };

  const handleDeleteProduct = async (priceRecordId, productId) => {
    if (
      !window.confirm(
        'Tem certeza que deseja remover este produto do seu mercado?'
      )
    ) {
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const priceRecordDeleteResponse = await api.delete(
        `/price-records/${priceRecordId}`
      );

      if (priceRecordDeleteResponse.status === 204) {
        setMessage('Produto removido do seu mercado com sucesso!');
        setMessageType('success');
        // Após a deleção, recarregar os produtos
        refreshProducts();
      } else {
        setMessage('Erro ao remover produto do mercado.');
        setMessageType('error');
      }
    } catch (error) {
      if (error.response.status === 404) {
        setMessage('Registro de preço ou produto não encontrado.');
      } else {
        setMessage('Erro ao remover produto do mercado. Tente novamente.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      if (isEditing) {
        await api.put(`/products/${data.id}`, {
          name: data.name,
          barCode: data.barCode,
          variableDescription: data.variableDescription,
        });
        await api.put(`/price-records/${data.priceRecordId}`, {
          price: parseFloat(data.price),
        });
        setMessage('Produto atualizado com sucesso!');
      } else {
        const productResponse = await api.post('/products', {
          name: data.name,
          barCode: data.barCode,
          variableDescription: data.variableDescription,
        });
        const newProductId = productResponse.data.id;

        await api.post('/price-records', {
          price: parseFloat(data.price),
          productId: newProductId,
          supermarketId,
          userId: parseInt(localStorage.getItem('userId'), 10),
        });
        setMessage('Produto adicionado com sucesso!');
      }
      setMessageType('success');
      setShowAddEditModal(false);
      // Após o submit bem-sucedido, recarregar os produtos
      refreshProducts();
    } catch (error) {
      if (error.response.status === 400) {
        setMessage(error.response.data.error || 'Dados inválidos.');
      } else if (error.response.status === 409) {
        setMessage('Produto com este nome ou código de barras já existe.');
      } else {
        setMessage('Erro ao salvar produto. Tente novamente.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles['logo-area']}>
          <img
            src="/Global_Market_Logo.png"
            alt="Logo"
            className={styles.logo}
          />
          <h1 className={styles.title}>Global Market</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.headerButton}
            onClick={handleEditarSupermarket}
            aria-label="Editar supermercado"
          >
            <UserIcon className={styles.headerIcon} />
          </button>
        </div>
      </header>

      <h2 className={styles.subtitulo}>Meus Produtos:</h2>

      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </div>
      )}

      <div className={styles.actionsBar}>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddProductClick}
        >
          <PlusIcon className={styles.headerIcon} /> Adicionar Produto
        </button>
      </div>

      <div className={styles['produtos-grid']}>
        {products.length === 0 && !loading && (
          <p className={styles.noProductsMessage}>
            Nenhum produto cadastrado para este mercado.
          </p>
        )}
        {products.map((product) => (
          <div key={product.priceRecordId} className={styles.card}>
            <div className={styles['card-top']}>{product.name}</div>
            <div className={styles['card-body']}>
              <p className={styles.descricao}>{product.description}</p>
              <p className={styles.preco}>
                R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
              </p>
              <div className={styles.acoes}>
                <button
                  type="button"
                  className={styles.editar}
                  onClick={() => handleEditProductClick(product)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className={styles.excluir}
                  onClick={() =>
                    handleDeleteProduct(product.priceRecordId, product.id)
                  }
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddEditModal && (
        <ProductModal
          onClose={() => setShowAddEditModal(false)}
          onSubmit={handleModalSubmit}
          isEditing={isEditing}
          initialData={currentProductData}
        />
      )}
    </div>
  );
}

function ProductModal({ onClose, onSubmit, isEditing, initialData }) {
  const [name, setName] = useState((initialData && initialData.name) || '');
  const [barCode, setBarCode] = useState(
    (initialData && initialData.barCode) || ''
  );
  const [variableDescription, setVariableDescription] = useState(
    (initialData && initialData.variableDescription) || ''
  );
  const [price, setPrice] = useState((initialData && initialData.price) || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: (initialData && initialData.id) || null,
      priceRecordId: (initialData && initialData.priceRecordId) || null,
      name,
      barCode,
      variableDescription,
      price,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>
          {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <label htmlFor="productName">Nome do Produto</label>
          <input
            id="productName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="barCode">Código de Barras</label>
          <input
            id="barCode"
            type="text"
            value={barCode}
            onChange={(e) => setBarCode(e.target.value)}
            required
          />

          <label htmlFor="description">Descrição (Ex: 500g, 1L)</label>
          <input
            id="description"
            type="text"
            value={variableDescription}
            onChange={(e) => setVariableDescription(e.target.value)}
          />

          <label htmlFor="price">Preço</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <div className={styles.modalActions}>
            <button type="submit" className={styles.modalButton}>
              {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.modalButton} ${styles.cancel}`}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ProductModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    priceRecordId: PropTypes.number,
    name: PropTypes.string,
    barCode: PropTypes.string,
    variableDescription: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

ProductModal.defaultProps = {
  initialData: {},
};
