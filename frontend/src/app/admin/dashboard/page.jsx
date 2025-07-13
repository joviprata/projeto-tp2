/* eslint-disable no-alert, no-undef, jsx-a11y/label-has-associated-control, no-use-before-define, no-console, no-unused-vars, react/no-array-index-key */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './dashboard.module.css';
import UsersPanel from './components/UsersPanel';
import SupermarketsPanel from './components/SupermarketsPanel';
import ProductsPanel from './components/ProductsPanel';
import PriceRecordsPanel from './components/PriceRecordsPanel';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se é admin
    if (typeof window !== 'undefined') {
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin) {
        router.push('/admin/login');
        return;
      }
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminToken');
    }
    router.push('/admin/login');
  };

  const tabs = [
    { id: 'users', label: 'Usuários', icon: '👥' },
    { id: 'supermarkets', label: 'Supermercados', icon: '🏪' },
    { id: 'products', label: 'Produtos', icon: '📦' },
    { id: 'priceRecords', label: 'Registros de Preço', icon: '💰' },
  ];

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'users':
        return <UsersPanel />;
      case 'supermarkets':
        return <SupermarketsPanel />;
      case 'products':
        return <ProductsPanel />;
      case 'priceRecords':
        return <PriceRecordsPanel />;

      default:
        return <UsersPanel />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Image
              src="/Global_Market_Logo.png"
              width={40}
              height={40}
              alt="Logo"
              className={styles.logo}
            />
            <h1 className={styles.title}>Painel Administrativo</h1>
          </div>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <span className={styles.logoutIcon}>🚪</span>
            Sair
          </button>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Panel */}
        <main className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              {tabs.find((tab) => tab.id === activeTab) &&
                tabs.find((tab) => tab.id === activeTab).label}
            </h2>
          </div>
          <div className={styles.panelContent}>{renderActivePanel()}</div>
        </main>
      </div>
    </div>
  );
}
