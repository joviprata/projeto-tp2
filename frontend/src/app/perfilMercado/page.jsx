'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Perfil() {
  // Valores iniciais simulados (poderiam vir de uma API)
  const id = localStorage.getItem('userId');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [endereco, setEndereco] = useState('');

  // Função para lidar com mudanças nos campos
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const makeUpdate = async (e) => {
    try {
      console.log(nome);
      console.log(email);
      console.log(senha);
      console.log(endereco);
      const response = await axios.put(
        'http://localhost:3001/supermarkets/${id}',
        {
          name: nome,
          email,
          password: senha,
          address: endereco,
        }
      );
      console.log(response.status);
      if (response.status === 200 && response.data.role === 'GERENTE') {
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
          <form className={styles.form} onSubmit={handleEditar}>
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
              <button className={styles.deleteButton} type="button">
                Excluir
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
