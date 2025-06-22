'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const makeAuth = async(e) => {
    try {
      const response = await axios.post('URL', {
      email: email,
      senha: senha
    });
    } catch (error){
      setMessage('Erro inesperado ao tentar logar.');
    }
  }
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadRedirect = (e) => {
    e.preventDefault();
    router.push('/cadastro');
  };
  return (
    
    <div className={styles.container}>
      <header className={styles.header}>
        <Image
          src="/Global_Market_Logo.png"
          //width={200}
          //height={200}
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
        <button className={styles.button}>Fazer login</button>
        <p className= {styles.bruno}>
          Não possui conta? <a href="/cadastro" onClick={cadRedirect}>clique aqui</a>
        </p>
      </div>
    </div>
  );
}
