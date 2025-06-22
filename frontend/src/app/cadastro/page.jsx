'use client';

import { useState } from 'react';
import styles from './Cadastro.module.css';
import Image from 'next/image';

export default function Cadastro() {
  const [mostrarAdd, setMostrarAdd] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [endereco, setEndereco] = useState('');
  
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
        <input type="text" placeholder="Nome / Nome do Mercado" className={styles.input} value={nome}/>
        <input type="text" placeholder="E-mail" className={styles.input} value={email}/>
        <input type="password" placeholder="Senha" className={styles.input} value={senha}/>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={mostrarAdd}
            onChange={(e) => setMostrarAdd(e.target.checked)}
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxCustom}></span>
          <span className={styles.checkboxText}>
            Caso seja um Gerente de um supermercado, marque esta opção!
          </span>
        </label>
        {mostrarAdd && (
          <input type="text" placeholder="Endereço" className={styles.input} value={endereco}/>
        )}
        
        <button className={styles.button}>Criar conta</button>
      </div>
    </div>
  );
} 
