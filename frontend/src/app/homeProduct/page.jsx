'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import api from '../../../src/config/api'; // Importa a instância do axios configurada

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

export default function Produtos() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supermarketId, setSupermarketId] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductData, setCurrentProductData] = useState(null); // Para editar
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  useEffect(() => {
    const fetchSupermarketAndProducts = async () => {
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
        setMessageType('success');
      } catch (error) {
        console.error(
          'Erro ao carregar dados do supermercado ou produtos:',
          error
        );
        if (error.response?.status === 404) {
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
    };

    fetchSupermarketAndProducts();
  }, [router]);

  const refreshProducts = () => {
    setLoading(true);
  };

  const handleEditarSupermarket = () => {
    router.push('/perfilMercado');
  };

  const handleAddProductClick = () => {
    setIsEditing(false);
    setCurrentProductData(null);
    setShowAddEditModal(true);
  };

  const handleEditProductClick = (product) => {
    setIsEditing(true);
    setCurrentProductData({
      id: product.id, // ID do produto
      priceRecordId: product.priceRecordId, // ID do registro de preço
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
        setProducts(products.filter((p) => p.priceRecordId !== priceRecordId));
      } else {
        setMessage('Erro ao remover produto do mercado.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro ao deletar produto/registro de preço:', error);
      if (error.response?.status === 404) {
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
        // Atualizar Produto e Registro de Preço
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
        // Adicionar Novo Produto e Registro de Preço
        const productResponse = await api.post('/products', {
          name: data.name,
          barCode: data.barCode,
          variableDescription: data.variableDescription,
        });
        const newProductId = productResponse.data.id;

        await api.post('/price-records', {
          price: parseFloat(data.price),
          productId: newProductId,
          supermarketId: supermarketId,
          userId: parseInt(localStorage.getItem('userId'), 10), // Gerente é o usuário que registra o preço
        });
        setMessage('Produto adicionado com sucesso!');
      }
      setMessageType('success');
      setShowAddEditModal(false);
      refreshProducts(); // Recarrega a lista para mostrar as mudanças
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      if (error.response?.status === 400) {
        setMessage(error.response.data.error || 'Dados inválidos.');
      } else if (error.response?.status === 409) {
        setMessage('Produto com este nome ou código de barras já existe.');
      } else {
        setMessage('Erro ao salvar produto. Tente novamente.');
      }
      setMessageType('error');
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
              </p>{' '}
              {/* Formata preço */}
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

// Componente de Modal para Adicionar/Editar Produto
function ProductModal({ onClose, onSubmit, isEditing, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [barCode, setBarCode] = useState(initialData?.barCode || '');
  const [variableDescription, setVariableDescription] = useState(
    initialData?.variableDescription || ''
  );
  const [price, setPrice] = useState(initialData?.price || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id, // Envia ID para edição
      priceRecordId: initialData?.priceRecordId, // Envia priceRecordId para edição
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
  initialData: PropTypes.object,
};

ProductModal.defaultProps = {
  initialData: null,
};
