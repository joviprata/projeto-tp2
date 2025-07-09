'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './page.module.css';

export default function Perfil() {
  const router = useRouter();
  // Valores iniciais simulados (poderiam vir de uma API)
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [endereco, setEndereco] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Acessa o localStorage apenas após o componente estar montado
  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      setId(storedId);
    }
  }, []);

  // Função para lidar com mudanças nos campos
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const makeUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log('id: ', id);
      console.log('nome: ', nome);
      console.log('email: ', email);
      console.log('senha: ', senha);
      console.log('endereco: ', endereco);
      const response = await axios.put(
        `http://localhost:3001/supermarkets/manager/${id}`,
        {
          name: nome,
          email,
          password: senha,
          address: endereco,
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        console.log('Edição realizada com sucesso!');
        router.push('/homeProduct');
      }
      if (response.status === 401) {
        console.log('Usuário ou senha inválidos');
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirmed = async () => {
    if (showDeleteModal === true) {
      handleCancelDelete();
      try {
        const response = await axios.delete(
          `http://localhost:3001/users/${id}`
        );
        console.log(response.status);
        if (response.status === 200) {
          console.log(`Supermercado ${id} deletado com sucesso!`);
          router.push('/login');
        }
        if (response.status === 404) {
          console.log('Supermercado não encontrado');
          alert('Supermercado não encontrado');
        }
        if (response.status === 500) {
          console.log('Erro interno do servidor');
          alert('Erro interno do servidor');
        }
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        handleCancelDelete();
      }
    }
  };

  return (
    <div className={styles.background}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <img
            src="/Global_Market_Logo.png"
            alt="Logo"
            className={styles.logo}
          />
          <span className={styles.logoText}>Global Market</span>
        </div>
        <div className={styles.icons}>
          <img src="/person-outline.svg" alt="Perfil" className={styles.icon} />
          <img src="/cart-outline.svg" alt="Carrinho" className={styles.icon} />
          <img src="/log-out-outline.svg" alt="Sair" className={styles.icon} />
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Dados do perfil</h1>
        <section className={styles.card}>
          <div className={styles.profileIconArea}>
            <img
              src="/person-outline.svg"
              alt="Perfil"
              className={styles.profileIcon}
            />
          </div>
          <form className={styles.form} onSubmit={makeUpdate}>
            <label className={styles.label} htmlFor="nome">
              Nome
            </label>
            <input
              className={styles.input}
              id="nome"
              type="text"
              value={nome}
              onChange={handleChange(setNome)}
            />
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              type="email"
              value={email}
              onChange={handleChange(setEmail)}
            />
            <label className={styles.label} htmlFor="senha">
              Senha
            </label>
            <input
              className={styles.input}
              id="senha"
              type="password"
              value={senha}
              onChange={handleChange(setSenha)}
            />
            <label className={styles.label} htmlFor="endereco">
              Endereço
            </label>
            <input
              className={styles.input}
              id="endereco"
              type="text"
              value={endereco}
              onChange={handleChange(setEndereco)}
            />
            <div className={styles.buttonRow}>
              <button className={styles.editButton} type="submit">
                Editar
              </button>
              <button
                className={styles.deleteButton}
                type="button"
                onClick={handleDeleteClick}
              >
                Excluir
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Confirmar Exclusão</h2>
            <p className={styles.modalText}>
              Tem certeza que deseja excluir este supermercado?
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteConfirmed}
              >
                Confirmar
              </button>
              <button
                className={styles.cancelButton}
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
