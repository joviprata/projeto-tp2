/* eslint-disable no-alert, no-undef, jsx-a11y/label-has-associated-control, no-use-before-define, no-console, no-unused-vars, react/no-array-index-key */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './login.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação simples sem backend
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      // Salvar no localStorage que é admin
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', 'admin-token');
      }

      // Redirecionar para o painel
      router.push('/admin/dashboard');
    } else {
      setError('Credenciais inválidas. Use admin/admin');
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <Image
            src="/Global_Market_Logo.png"
            width={80}
            height={80}
            alt="Logo"
            className={styles.logo}
          />
          <h1 className={styles.title}>Painel Administrativo</h1>
          <p className={styles.subtitle}>Global Market</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.hint}>
            Use: <strong>admin</strong> / <strong>admin</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
