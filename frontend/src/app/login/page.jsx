'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const makeAuth = async (e) => {
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

      if (response.status === 401) {
        console.log('Usuário ou senha inválidos');
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
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
        <input
          className={styles.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button className={styles.button} onClick={makeAuth}>
          Fazer login
        </button>
        <p className={styles.bruno}>
          Não possui conta?{' '}
          <a href="/cadastro" onClick={cadRedirect}>
            clique aqui
          </a>
        </p>
      </div>
    </div>
  );
}
