'use client';

import styles from './Cadastro.module.css';
import Image from 'next/image';

export default function Cadastro() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image
          src="/../../public/image.png"
          width={40}
          height={40}
          alt="Logo"
          className={styles.logo}
        />
        <h1>Global Market</h1>
      </header>

      <div className={styles.formContainer}>
        <input type="text" placeholder="Nome do Mercado" className={styles.input} />
        <input type="text" placeholder="CNPJ" className={styles.input} />
        <input type="email" placeholder="E-mail" className={styles.input} />
        <input type="password" placeholder="Senha" className={styles.input} />
        <button className={styles.button}>Criar conta</button>
      </div>
    </div>
  );
}
