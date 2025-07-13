/* eslint-disable no-alert, no-undef, jsx-a11y/label-has-associated-control, no-use-before-define, no-console, no-unused-vars, react/no-array-index-key */

'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../config/api';
import styles from './UsersPanel.module.css';

export default function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'client',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.users || response.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      await fetchUsers();
      handleCloseModal();
      setError('');
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      setError('Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        await fetchUsers();
        setError('');
      } catch (err) {
        console.error('Erro ao excluir usuário:', err);
        setError('Erro ao excluir usuário');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      userType: user.userType,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      userType: 'client',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortedUsers = () => {
    const sorted = [...users].sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'userType':
          aValue = a.userType.toLowerCase();
          bValue = b.userType.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
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

  if (loading) {
    return <div className={styles.loading}>Carregando usuários...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Gerenciar Usuários</h3>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Novo Usuário
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
                onClick={() => handleSort('name')}
              >
                Nome {getSortIcon('name')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('email')}
              >
                Email {getSortIcon('email')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('userType')}
              >
                Tipo {getSortIcon('userType')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('createdAt')}
              >
                Data de Criação {getSortIcon('createdAt')}
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {getSortedUsers().map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.badge} ${styles[user.userType]}`}>
                    {user.userType === 'client' ? 'Cliente' : 'Manager'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user.id)}
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
              <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
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
                <label htmlFor="name">Nome</label>
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
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password">
                  {editingUser
                    ? 'Nova Senha (deixe vazio para manter)'
                    : 'Senha'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="userType">Tipo de Usuário</label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                >
                  <option value="client">Cliente</option>
                  <option value="manager">Manager</option>
                </select>
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
                  {editingUser ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
