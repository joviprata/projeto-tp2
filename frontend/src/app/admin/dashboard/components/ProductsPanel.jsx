/* eslint-disable no-alert, no-undef, jsx-a11y/label-has-associated-control, no-use-before-define, no-console, no-unused-vars, react/no-array-index-key */

'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../config/api';
import styles from './ProductsPanel.module.css';

export default function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    barCode: '',
    variableDescription: '',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data || response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      barCode: '',
      variableDescription: '',
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      await fetchProducts();
      handleCloseModal();
      setError('');
    } catch (err) {
      setError('Erro ao salvar produto');
    }
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-alert, no-undef
    if (
      typeof window !== 'undefined' &&
      window.confirm('Tem certeza que deseja excluir este produto?')
    ) {
      try {
        await api.delete(`/products/${id}`);
        await fetchProducts();
        setError('');
      } catch (err) {
        setError('Erro ao excluir produto');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barCode: product.barCode,
      variableDescription: product.variableDescription || '',
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Carregando produtos...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Gerenciar Produtos</h3>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Novo Produto
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Código de Barras</th>
              <th>Descrição</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.barCode}</td>
                <td>{product.variableDescription || 'N/A'}</td>
                <td>
                  {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(product.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Nome do Produto</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="barCode">Código de Barras</label>
                <input
                  type="text"
                  id="barCode"
                  name="barCode"
                  value={formData.barCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="variableDescription">
                  Descrição (opcional)
                </label>
                <textarea
                  id="variableDescription"
                  name="variableDescription"
                  value={formData.variableDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingProduct ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
