/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { React, useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const makeAuth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password: senha,
      });

      if (response.status === 200) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', response.data.role);

        if (response.data.role === 'GERENTE') {
          router.push('/homeProduct');
        } else {
          router.push('/homeCliente');
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Credenciais inválidas');
        } else {
          setErrorMessage('Erro no servidor. Tente novamente mais tarde.');
        }
      } else {
        setErrorMessage('Erro de conexão. Verifique sua internet.');
      }

      // Efeito visual de erro
      const form = document.getElementById('loginForm');
      form.classList.add(styles.shake);
      setTimeout(() => {
        form.classList.remove(styles.shake);
      }, 500);
    }
  };

  const cadRedirect = (e) => {
    e.preventDefault();
    router.push('/cadastro');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image
          src="/Global_Market_Logo.png"
          width={100}
          height={100}
          alt="Logo"
          className={styles.logo}
        />
        <h1>Global Market</h1>
      </header>

      <div className={styles.formContainer}>
        <form id="loginForm" onSubmit={makeAuth} className={styles.form}>
          <label htmlFor="email-input" className={styles.label}>
            E-mail
          </label>
          <input
            className={styles.input}
            id="email-input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password-input" className={styles.label}>
            Senha
          </label>
          <input
            className={styles.input}
            id="password-input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          <button type="submit" className={styles.button}>
            Fazer login
          </button>

          <p className={styles.bruno}>
            Não possui conta?{' '}
            <a href="/cadastro" onClick={cadRedirect}>
              clique aqui
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
