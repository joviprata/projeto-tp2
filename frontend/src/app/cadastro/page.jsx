'use client';

import { React, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './Cadastro.module.css';

export default function Cadastro() {
  const [mostrarAdd, setMostrarAdd] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [endereco, setEndereco] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!nome || !email || !senha || (mostrarAdd && !endereco)) {
      setMessage('Preencha todos os campos obrigatórios');
      setMessageType('error');
      return;
    }

    try {
      const endpoint = mostrarAdd
        ? 'http://localhost:3001/auth/register/manager'
        : 'http://localhost:3001/auth/register/user';

      const payload = mostrarAdd
        ? { name: nome, email, password: senha, address: endereco }
        : { name: nome, email, password: senha };

      const response = await axios.post(endpoint, payload);

      if (response.status === 201) {
        setMessage(
          `Cadastro de ${mostrarAdd ? 'gerente' : 'usuário'} realizado com sucesso!`
        );
        setMessageType('success');

        // Resetar campos
        setNome('');
        setEmail('');
        setSenha('');
        setEndereco('');
        setMostrarAdd(false);

        // Redirecionar após 2 segundos
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar. Por favor, tente novamente.';

      // Mensagens mais específicas
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('network')) {
        errorMessage = 'Problema de conexão. Verifique sua rede.';
      }

      setMessage(errorMessage);
      setMessageType('error');
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
          priority
        />
        <h1>Global Market</h1>
      </header>

      <div className={styles.formContainer}>
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Nome / Nome do Mercado"
          className={styles.input}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-label="Nome completo ou nome do mercado"
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Endereço de e-mail"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className={styles.input}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          aria-label="Senha de acesso"
          required
          minLength={6}
        />

        <label className={styles.checkboxContainer} htmlFor="gerenteCheckbox">
          <input
            type="checkbox"
            checked={mostrarAdd}
            onChange={(e) => setMostrarAdd(e.target.checked)}
            className={styles.checkboxInput}
            id="gerenteCheckbox"
          />
          <span className={styles.checkboxCustom} aria-hidden="true" />
          <span className={styles.checkboxText}>
            Marque se for gerente de supermercado
          </span>
        </label>

        {mostrarAdd && (
          <input
            type="text"
            placeholder="Endereço completo"
            className={styles.input}
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            aria-label="Endereço do estabelecimento"
            required
          />
        )}

        <button
          type="button"
          className={styles.button}
          onClick={handleSubmit}
          aria-label="Criar nova conta"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}
