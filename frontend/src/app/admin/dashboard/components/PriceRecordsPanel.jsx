/* eslint-disable no-alert, no-undef, jsx-a11y/label-has-associated-control, no-use-before-define, no-console, no-unused-vars, react/no-array-index-key */

'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../config/api';
import styles from './PriceRecordsPanel.module.css';

export default function PriceRecordsPanel() {
  const [priceRecords, setPriceRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    price: '',
    productId: '',
    supermarketId: '',
    userId: '',
    available: true,
    verified: false,
  });

  useEffect(() => {
    fetchPriceRecords();
    fetchProducts();
    fetchSupermarkets();
    fetchUsers();
  }, []);

  const fetchPriceRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/price-records');
      setPriceRecords(response.data.data || response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar registros de preço');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data || response.data);
    } catch (err) {
      setError('Erro ao carregar produtos');
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const response = await api.get('/supermarkets');
      setSupermarkets(response.data.supermarkets || response.data);
    } catch (err) {
      setError('Erro ao carregar supermercados');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || response.data);
    } catch (err) {
      setError('Erro ao carregar usuários');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        productId: parseInt(formData.productId, 10),
        supermarketId: parseInt(formData.supermarketId, 10),
        userId: parseInt(formData.userId, 10),
      };

      if (editingRecord) {
        await api.put(`/price-records/${editingRecord.id}`, payload);
      } else {
        await api.post('/price-records', payload);
      }
      await fetchPriceRecords();
      handleCloseModal();
      setError('');
    } catch (err) {
      setError('Erro ao salvar registro de preço');
    }
  };

  const handleDelete = async (id) => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Tem certeza que deseja excluir este registro?')
    ) {
      try {
        await api.delete(`/price-records/${id}`);
        await fetchPriceRecords();
        setError('');
      } catch (err) {
        setError('Erro ao excluir registro de preço');
      }
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      price: record.price.toString(),
      productId: record.productId.toString(),
      supermarketId: record.supermarketId.toString(),
      userId: record.userId.toString(),
      available: record.available,
      verified: record.verified,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
    setFormData({
      price: '',
      productId: '',
      supermarketId: '',
      userId: '',
      available: true,
      verified: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortedRecords = () => {
    const sorted = [...priceRecords].sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'product':
          aValue = getProductName(a.productId).toLowerCase();
          bValue = getProductName(b.productId).toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'supermarket':
          aValue = getSupermarketName(a.supermarketId).toLowerCase();
          bValue = getSupermarketName(b.supermarketId).toLowerCase();
          break;
        case 'user':
          aValue = getUserName(a.userId).toLowerCase();
          bValue = getUserName(b.userId).toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.recordDate);
          bValue = new Date(b.recordDate);
          break;
        case 'available':
          aValue = a.available;
          bValue = b.available;
          break;
        case 'verified':
          aValue = a.verified;
          bValue = b.verified;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'N/A';
  };

  const getSupermarketName = (supermarketId) => {
    const supermarket = supermarkets.find((s) => s.id === supermarketId);
    return supermarket ? supermarket.name : 'N/A';
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'N/A';
  };

  if (loading) {
    return (
      <div className={styles.loading}>Carregando registros de preço...</div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Gerenciar Registros de Preço</h3>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Novo Registro
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('id')}
              >
                ID {getSortIcon('id')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('product')}
              >
                Produto {getSortIcon('product')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('price')}
              >
                Preço {getSortIcon('price')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('supermarket')}
              >
                Supermercado {getSortIcon('supermarket')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('user')}
              >
                Usuário {getSortIcon('user')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('date')}
              >
                Data {getSortIcon('date')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('available')}
              >
                Disponível {getSortIcon('available')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('verified')}
              >
                Verificado {getSortIcon('verified')}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {getSortedRecords().map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{getProductName(record.productId)}</td>
                <td>{formatPrice(record.price)}</td>
                <td>{getSupermarketName(record.supermarketId)}</td>
                <td>{getUserName(record.userId)}</td>
                <td>
                  {new Date(record.recordDate).toLocaleDateString('pt-BR')}
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${record.available ? styles.available : styles.unavailable}`}
                  >
                    {record.available ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${record.verified ? styles.verified : styles.unverified}`}
                  >
                    {record.verified ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => handleEdit(record)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(record.id)}
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
              <h3>{editingRecord ? 'Editar Registro' : 'Novo Registro'}</h3>
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
                <label htmlFor="productId">Produto</label>
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="supermarketId">Supermercado</label>
                <select
                  id="supermarketId"
                  name="supermarketId"
                  value={formData.supermarketId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um supermercado</option>
                  {supermarkets.map((supermarket) => (
                    <option key={supermarket.id} value={supermarket.id}>
                      {supermarket.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="userId">Usuário</label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione um usuário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="price">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                  />
                  Disponível
                </label>
              </div>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="verified"
                    checked={formData.verified}
                    onChange={handleInputChange}
                  />
                  Verificado
                </label>
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
                  {editingRecord ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
