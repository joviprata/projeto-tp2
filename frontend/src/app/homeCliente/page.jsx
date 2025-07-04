'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

// Importar SVGs como componentes React
import CartIcon from '../../../public/cart-outline.svg';
import PersonIcon from '../../../public/person-outline.svg';
import LogoutIcon from '../../../public/log-out-outline.svg';
import SearchIcon from '../../../public/search-outline.svg';

export default function HomeCliente() {
  // Placeholder de produtos
  const produtos = Array(8).fill({
    nome: 'Nome Produto 123',
    descricao:
      'Descrição do produto descrição do produto descrição do produto descrição do produto...',
    preco: 1000.0,
    mercado: 'Nome do Mercado',
  });

  // Estado do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  // Abrir modal
  const handleAddCart = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidade(1);
    setModalOpen(true);
  };

  // Fechar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setProdutoSelecionado(null);
  };

  // Calcular preço total
  const precoTotal = produtoSelecionado ? (produtoSelecionado.preco * quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles['logo-area']}>
          <img src="/Global_Market_Logo.png" alt="Logo" className={styles.logo} />
          <h1 className={styles.title}>Global Market</h1>
        </div>
        <div className={styles.icons}>
          <span className={styles.icon}><PersonIcon className={styles.invertedIcon} /></span>
          <span className={styles.icon}><CartIcon className={styles.invertedIcon} /></span>
          <span className={styles.icon}><LogoutIcon className={styles.invertedIcon} /></span>
        </div>
      </header>

      {/* Filtros */}
      <div className={styles.filtrosBar}>
        <input className={styles.filtroInput} placeholder="Filtrar por Preço" />
        <input className={styles.filtroInput} placeholder="Filtrar por Localização" />
        <div className={styles.searchWrapper}>
          <input className={styles.searchInput} placeholder="Pesquisar Produto" />
          <button className={styles.searchBtn}><SearchIcon className={styles.invertedIcon} /></button>
        </div>
      </div>

      {/* Grid de produtos */}
      <div className={styles['produtos-grid']}>
        {produtos.map((produto, index) => (
          <div key={index} className={styles.card}>
            <div className={styles['card-top']}>{produto.nome}</div>
            <div className={styles['card-body']}>
              <p className={styles.descricao}>{produto.descricao}</p>
              <div className={styles.cardInfo}>
                <span>Nome do Mercado</span>
                <span>R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <button className={styles.addCartBtn} onClick={() => handleAddCart(produto)}>
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de quantidade */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>Selecione a quantidade:</div>
            <div className={styles.modalBody}>
              <div className={styles.modalProduto}>{produtoSelecionado?.nome}</div>
              <div className={styles.modalSliderRow}>
                <span>{quantidade} unidade{quantidade > 1 ? 's' : ''}</span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={quantidade}
                  onChange={e => setQuantidade(Number(e.target.value))}
                  className={styles.slider}
                />
                <span>{precoTotal}</span>
              </div>
              <div className={styles.modalBtns}>
                <button className={styles.addCartBtn} onClick={handleCloseModal}>Adicionar ao carrinho</button>
                <button className={styles.cancelBtn} onClick={handleCloseModal}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}