/* eslint-disable no-alert, no-undef, jsx-a11y/label-has-associated-control, no-use-before-define, no-console, no-unused-vars, react/no-array-index-key */

'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../config/api';
import styles from './SupermarketsPanel.module.css';

export default function SupermarketsPanel() {
  const [supermarkets, setSupermarkets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupermarket, setEditingSupermarket] = useState(null);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    managerId: '',
    managerName: '',
    managerEmail: '',
    managerPassword: '',
  });

  useEffect(() => {
    fetchSupermarkets();
    fetchUsers();
  }, []);

  const fetchSupermarkets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/supermarkets');
      setSupermarkets(response.data.supermarkets || response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar supermercados');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const allUsers = response.data.users || response.data;
      setUsers(allUsers.filter((user) => user.userType === 'manager'));
    } catch (err) {
      setError('Erro ao carregar usuários');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupermarket) {
        await api.put(`/supermarkets/${editingSupermarket.id}`, {
          name: formData.name,
          address: formData.address,
        });
      } else {
        // Criar manager primeiro
        const managerResponse = await api.post('/users', {
          name: formData.managerName,
          email: formData.managerEmail,
          password: formData.managerPassword,
          userType: 'manager',
        });

        // Criar supermercado
        await api.post('/supermarkets', {
          name: formData.name,
          address: formData.address,
          managerId: managerResponse.data.id,
        });
      }
      await fetchSupermarkets();
      await fetchUsers();
      handleCloseModal();
      setError('');
    } catch (err) {
      setError('Erro ao salvar supermercado');
    }
  };

  const handleDelete = async (id) => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('Tem certeza que deseja excluir este supermercado?')
    ) {
      try {
        await api.delete(`/supermarkets/${id}`);
        await fetchSupermarkets();
        await fetchUsers();
        setError('');
      } catch (err) {
        setError('Erro ao excluir supermercado');
      }
    }
  };

  const handleEdit = (supermarket) => {
    setEditingSupermarket(supermarket);
    setFormData({
      name: supermarket.name,
      address: supermarket.address,
      managerId: supermarket.managerId || '',
      managerName: '',
      managerEmail: '',
      managerPassword: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupermarket(null);
    setFormData({
      name: '',
      address: '',
      managerId: '',
      managerName: '',
      managerEmail: '',
      managerPassword: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Carregando supermercados...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Gerenciar Supermercados</h3>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Novo Supermercado
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Endereço</th>
              <th>Manager ID</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {supermarkets.map((supermarket) => (
              <tr key={supermarket.id}>
                <td>{supermarket.id}</td>
                <td>{supermarket.name}</td>
                <td>{supermarket.address}</td>
                <td>{supermarket.managerId}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => handleEdit(supermarket)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(supermarket.id)}
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
              <h3>
                {editingSupermarket
                  ? 'Editar Supermercado'
                  : 'Novo Supermercado'}
              </h3>
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
                <label htmlFor="name">Nome do Supermercado</label>
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
                <label htmlFor="address">Endereço</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!editingSupermarket && (
                <>
                  <h4 className={styles.sectionTitle}>Dados do Manager</h4>
                  <div className={styles.inputGroup}>
                    <label htmlFor="managerName">Nome do Manager</label>
                    <input
                      type="text"
                      id="managerName"
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="managerEmail">Email do Manager</label>
                    <input
                      type="email"
                      id="managerEmail"
                      name="managerEmail"
                      value={formData.managerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="managerPassword">Senha do Manager</label>
                    <input
                      type="password"
                      id="managerPassword"
                      name="managerPassword"
                      value={formData.managerPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingSupermarket ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
