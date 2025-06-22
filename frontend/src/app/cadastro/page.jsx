'use client';

import { use, useState } from 'react';
import styles from './Cadastro.module.css';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function Cadastro() {
  const [mostrarAdd, setMostrarAdd] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [endereco, setEndereco] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mostrarAdd) {
        const response = await axios.post(
          'http://localhost:3001/auth/register/manager',
          {
            name: nome,
            email: email,
            password: senha,
            address: endereco,
          },
        );
        console.log(response.data);
        if (response.status === 201) {
          alert('Cadastro realizado com sucesso!');
          setNome('');
          setEmail('');
          setSenha('');
          setEndereco('');
          setMostrarAdd(false);
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
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
          type="text"
          placeholder="Nome / Nome do Mercado"
          className={styles.input}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="E-mail"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className={styles.input}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
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
          <input
            type="text"
            placeholder="Endereço"
            className={styles.input}
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        )}

        <button className={styles.button} onClick={handleSubmit}>
          Criar conta
        </button>
      </div>
    </div>
  );
}
