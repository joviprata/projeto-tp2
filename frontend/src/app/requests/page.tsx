'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './requests.module.css';

interface Request {
  id: string;
  productName: string;
  barCode: string;
  variableDescription?: string;
  price: number;
  supermarketId: number;
  supermarketName: string;
  userId: number;
  userName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
}

export default function UserRequestsPage() {
  const router = useRouter();
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRequests();
  }, []);

  const loadUserRequests = () => {
    try {
      setLoading(true);
      const allRequests = JSON.parse(
        localStorage.getItem('pendingPriceRequests') || '[]'
      );
      const userId = localStorage.getItem('userId') || '2';
      
      // Filtrar apenas as solicitações do usuário logado
      const filteredRequests = allRequests.filter(
        (request: Request) => request.userId === parseInt(userId)
      );
      
      setUserRequests(filteredRequests);
    } catch (err) {
      console.error('Erro ao carregar solicitações:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: 'Aguardando Aprovação', class: 'pending' },
      approved: { text: 'Aprovado', class: 'approved' },
      rejected: { text: 'Rejeitado', class: 'rejected' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`${styles.badge} ${styles[config.class]}`}>
        {config.text}
      </span>
    );
  };

  const Logo = () => (
    <Image
      src="/Global_Market_Logo.png"
      width={40}
      height={40}
      alt="Logo"
      className={styles.logo}
    />
  );

  const handleLogoClick = () => {
    router.push('/homeCliente');
  };

  const handleBackClick = () => {
    router.push('/homeCliente');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Carregando suas solicitações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.brandIcon} onClick={handleLogoClick}>
              <Logo />
            </div>
            <h1 className={styles.title}>Minhas Solicitações</h1>
          </div>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackClick}
          >
            Voltar
          </button>
        </div>
      </header>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.summary}>
          <h2>Status das Suas Solicitações</h2>
          <div className={styles.summaryStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {userRequests.filter(r => r.status === 'pending').length}
              </span>
              <span className={styles.statLabel}>Pendentes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {userRequests.filter(r => r.status === 'approved').length}
              </span>
              <span className={styles.statLabel}>Aprovadas</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {userRequests.filter(r => r.status === 'rejected').length}
              </span>
              <span className={styles.statLabel}>Rejeitadas</span>
            </div>
          </div>
        </div>

        {userRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Nenhuma solicitação encontrada</h3>
            <p>Você ainda não fez nenhuma solicitação de registro de preço.</p>
            <button
              type="button"
              className={styles.addButton}
              onClick={handleBackClick}
            >
              Adicionar Produto
            </button>
          </div>
        ) : (
          <div className={styles.requestsList}>
            {userRequests
              .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
              .map((request) => (
                <div key={request.id} className={styles.requestCard}>
                  <div className={styles.requestHeader}>
                    <h3 className={styles.productName}>{request.productName}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className={styles.requestDetails}>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Preço:</span>
                      <span className={styles.detailValue}>{formatPrice(request.price)}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Supermercado:</span>
                      <span className={styles.detailValue}>{request.supermarketName}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Código de Barras:</span>
                      <span className={styles.detailValue}>{request.barCode}</span>
                    </div>
                    {request.variableDescription && (
                      <div className={styles.detail}>
                        <span className={styles.detailLabel}>Descrição:</span>
                        <span className={styles.detailValue}>{request.variableDescription}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.requestFooter}>
                    <span className={styles.requestDate}>
                      Solicitado em {new Date(request.requestDate).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(request.requestDate).toLocaleTimeString('pt-BR')}
                    </span>
                    {request.status === 'approved' && request.approvedAt && (
                      <span className={styles.statusDate}>
                        Aprovado em {new Date(request.approvedAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {request.status === 'rejected' && request.rejectedAt && (
                      <span className={styles.statusDate}>
                        Rejeitado em {new Date(request.rejectedAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
