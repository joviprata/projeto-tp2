/* eslint-disable no-alert, no-undef, jsx-a11y/label-has-associated-control, no-use-before-define, no-console, no-unused-vars, react/no-array-index-key */

'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../../config/api';
import styles from './PendingRequestsPanel.module.css';

export default function PendingRequestsPanel() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('requestDate');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadPendingRequests();
    fetchProducts();
    fetchSupermarkets();
    fetchUsers();
  }, []);

  const loadPendingRequests = () => {
    try {
      setLoading(true);
      const requests = JSON.parse(
        localStorage.getItem('pendingPriceRequests') || '[]'
      );
      setPendingRequests(requests);
      setError('');
    } catch (err) {
      setError('Erro ao carregar solicitações pendentes');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data || response.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const response = await api.get('/supermarkets');
      setSupermarkets(response.data.supermarkets || response.data);
    } catch (err) {
      console.error('Erro ao carregar supermercados:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || response.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    }
  };

  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortedRequests = () => {
    const sorted = [...pendingRequests].sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortField) {
        case 'requestDate':
          aValue = new Date(a.requestDate);
          bValue = new Date(b.requestDate);
          break;
        case 'productName':
          aValue = a.productName.toLowerCase();
          bValue = b.productName.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'supermarketName':
          aValue = a.supermarketName.toLowerCase();
          bValue = b.supermarketName.toLowerCase();
          break;
        case 'userName':
          aValue = a.userName.toLowerCase();
          bValue = b.userName.toLowerCase();
          break;
        default:
          aValue = new Date(a.requestDate);
          bValue = new Date(b.requestDate);
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

  const approveRequest = async (requestId) => {
    try {
      const request = pendingRequests.find((r) => r.id === requestId);
      if (!request) return;

      // Primeiro, verificar se o produto já existe pelo código de barras
      let existingProduct = null;
      try {
        const searchResponse = await api.get('/products');
        existingProduct = searchResponse.data.find(
          (product) => product.barCode === request.barCode
        );
      } catch (err) {
        console.log('Erro ao buscar produtos existentes:', err);
      }

      let productToUse = existingProduct;

      // Se o produto não existe, criar um novo
      if (!existingProduct) {
        const productResponse = await api.post('/products', {
          name: request.productName,
          barCode: request.barCode,
          variableDescription: request.variableDescription || undefined,
        });
        productToUse = productResponse.data;
      }

      // Criar o registro de preço
      await api.post('/price-records', {
        price: request.price,
        productId: productToUse.id,
        supermarketId: request.supermarketId,
        userId: request.userId,
        available: true,
        verified: true, // Admin aprovado = verificado
      });

      // Atualizar status da solicitação
      const updatedRequests = pendingRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: 'approved', approvedAt: new Date().toISOString() }
          : req
      );

      // Salvar no localStorage
      localStorage.setItem(
        'pendingPriceRequests',
        JSON.stringify(updatedRequests)
      );
      setPendingRequests(updatedRequests);

      alert('Solicitação aprovada com sucesso!');
    } catch (err) {
      console.error('Erro ao aprovar solicitação:', err);
      setError('Erro ao aprovar solicitação');
    }
  };

  const rejectRequest = (requestId) => {
    if (window.confirm('Tem certeza que deseja rejeitar esta solicitação?')) {
      const updatedRequests = pendingRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: 'rejected', rejectedAt: new Date().toISOString() }
          : req
      );

      localStorage.setItem(
        'pendingPriceRequests',
        JSON.stringify(updatedRequests)
      );
      setPendingRequests(updatedRequests);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pendente', class: 'pending' },
      approved: { text: 'Aprovado', class: 'approved' },
      rejected: { text: 'Rejeitado', class: 'rejected' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`${styles.badge} ${styles[config.class]}`}>
        {config.text}
      </span>
    );
  };

  const pendingCount = pendingRequests.filter(
    (req) => req.status === 'pending'
  ).length;

  if (loading) {
    return <div className={styles.loading}>Carregando solicitações...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Solicitações de Registro de Preço</h3>
          <p className={styles.subtitle}>
            {pendingCount} solicitação(ões) pendente(s) de aprovação
          </p>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('requestDate')}
              >
                Data da Solicitação {getSortIcon('requestDate')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('productName')}
              >
                Produto {getSortIcon('productName')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('price')}
              >
                Preço {getSortIcon('price')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('supermarketName')}
              >
                Supermercado {getSortIcon('supermarketName')}
              </th>
              <th
                className={styles.sortableHeader}
                onClick={() => handleSort('userName')}
              >
                Solicitante {getSortIcon('userName')}
              </th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {getSortedRequests().map((request) => (
              <tr key={request.id}>
                <td>
                  {new Date(request.requestDate).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(request.requestDate).toLocaleTimeString('pt-BR')}
                </td>
                <td>
                  <div>
                    <strong>{request.productName}</strong>
                    {request.variableDescription && (
                      <div className={styles.productDescription}>
                        {request.variableDescription}
                      </div>
                    )}
                    <div className={styles.barCode}>
                      Código: {request.barCode}
                    </div>
                  </div>
                </td>
                <td>{formatPrice(request.price)}</td>
                <td>{request.supermarketName}</td>
                <td>{request.userName}</td>
                <td>{getStatusBadge(request.status)}</td>
                <td>
                  {request.status === 'pending' && (
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.approveButton}
                        onClick={() => approveRequest(request.id)}
                      >
                        Aprovar
                      </button>
                      <button
                        type="button"
                        className={styles.rejectButton}
                        onClick={() => rejectRequest(request.id)}
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}
                  {request.status === 'approved' && (
                    <span className={styles.actionText}>
                      Aprovado em{' '}
                      {new Date(request.approvedAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {request.status === 'rejected' && (
                    <span className={styles.actionText}>
                      Rejeitado em{' '}
                      {new Date(request.rejectedAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pendingRequests.length === 0 && (
          <div className={styles.emptyState}>
            <p>Nenhuma solicitação encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
