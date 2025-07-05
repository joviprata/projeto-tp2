'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <img src="/Global_Market_Logo.png" alt="logo" className={styles.logo} />
          <span className={styles.title}>Global Market</span>
        </div>
        <div className={styles.iconSection}>
        
        </div>
      </header>

      {/* Título */}
      <h1 className={styles.heading}>Dados do perfil</h1>

      {/* Formulário */}
      <div className={styles.formCard}>
        <div className={styles.formGroup}>
          <div className={styles.labelRow}>
            <User size={28} />
            <label className={styles.label}>Nome</label>
          </div>
          <input
            type="text"
            className={styles.input}
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className={styles.label}>Senha</label>
          <input
            type="password"
            className={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className={styles.buttonGroup}>
            <button className={styles.editButton} disabled>Editar</button>
            <button className={styles.deleteButton}>Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
}
