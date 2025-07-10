'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

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

export default function Produtos() {
  const router = useRouter();

  const produtos = Array(15).fill({
    nome: 'Nome Produto 123',
    descricao:
      'Descrição do produto descrição do produto descrição do produto descrição do produto...',
    preco: 'R$ 1000,00',
  });

  const handleEditarSupermarket = (e) => {
    e.preventDefault();
    router.push('/perfilMercado');
  };

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
            className={styles.headerButton}
            onClick={handleEditarSupermarket}
          >
            <UserIcon className={styles.headerIcon} />
          </button>
        </div>
      </header>

      <h2 className={styles.subtitulo}>Meus Produtos:</h2>
      <div className={styles['produtos-grid']}>
        {produtos.map((produto, index) => (
          <div key={index} className={styles.card}>
            <div className={styles['card-top']}>{produto.nome}</div>
            <div className={styles['card-body']}>
              <p className={styles.descricao}>{produto.descricao}</p>
              <p className={styles.preco}>{produto.preco}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
