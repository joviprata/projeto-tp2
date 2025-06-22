'use client';

import React from 'react';
import styles from './page.module.css';

export default function Produtos() {
  // Placeholder
  const produtos = Array(15).fill({
    nome: 'Nome Produto 123',
    descricao:
      'Descrição do produto descrição do produto descrição do produto descrição do produto...',
    preco: 'R$ 1000,00',
  });

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
        <div className={styles.icons}>
          <span className={styles.icon}>👤</span>
          <span className={styles.icon}>🔄</span>
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
              <div className={styles.acoes}>
                <button className={styles.editar}>Editar</button>
                <button className={styles.excluir}>Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
