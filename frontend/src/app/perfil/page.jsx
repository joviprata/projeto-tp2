'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../config/api';
import styles from './page.module.css';

export default function Perfil() {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState('');

  // Carrega dados do usuário ao montar o componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedId = localStorage.getItem('userId');
        
        if (!storedId || storedId === 'null' || storedId === 'undefined') {
          setMessage('Usuário não autenticado. Faça login novamente.');
          setLoading(false);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        setId(storedId);
        const response = await api.get(`/users/${storedId}`);
        
        if (response.status === 200) {
          const userData = response.data;
          setNome(userData.name || '');
          setEmail(userData.email || '');
          setSenha(''); // Não carregamos a senha por segurança
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        if (error.response?.status === 404) {
          setMessage('Usuário não encontrado. Faça login novamente.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else if (error.code === 'ERR_NETWORK') {
          setMessage('Erro de conexão. Verifique se o backend está rodando.');
        } else {
          setMessage('Erro ao carregar dados do usuário');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Função para lidar com mudanças nos campos
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setMessage(''); // Limpa mensagens de erro ao editar
  };

  // Função para atualizar dados do usuário
  const handleEditar = async (e) => {
    e.preventDefault();
    
    if (!nome.trim() || !email.trim()) {
      setMessage('Nome e email são obrigatórios');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        name: nome,
        email: email
      };
      
      // Só inclui senha se foi fornecida
      if (senha.trim()) {
        updateData.password = senha;
      }

      const response = await api.put(`/users/${id}`, updateData);

      if (response.status === 200) {
        setMessage('Dados atualizados com sucesso!');
        setSenha(''); // Limpa o campo de senha após salvar
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (error.response?.status === 400) {
        setMessage(error.response.data.message || 'Dados inválidos');
      } else if (error.response?.status === 404) {
        setMessage('Usuário não encontrado');
      } else {
        setMessage('Erro ao atualizar dados. Tente novamente.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Função para deletar usuário
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await api.delete(`/users/${id}`);
      
      if (response.status === 200) {
        // Limpa dados do localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        
        setMessage('Conta excluída com sucesso!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      if (error.response?.status === 404) {
        setMessage('Usuário não encontrado');
      } else {
        setMessage('Erro ao excluir conta. Tente novamente.');
      }
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className={styles.background}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <header className={styles.header}>
        <div className={styles.logoArea} onClick={() => router.push('/homeCliente')} style={{ cursor: 'pointer' }}>
          <img
            src="/Global_Market_Logo.png"
            alt="Logo"
            className={styles.logo}
          />
          <span className={styles.logoText}>Global Market</span>
        </div>
        <div className={styles.icons}>
          <img src="/person-outline.svg" alt="Perfil" className={styles.icon} />
          <img 
            src="/cart-outline.svg" 
            alt="Carrinho" 
            className={styles.icon} 
            onClick={() => router.push('/shopCart')}
            style={{ cursor: 'pointer' }}
          />
          <img 
            src="/log-out-outline.svg" 
            alt="Sair" 
            className={styles.icon} 
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>Dados do perfil</h1>
        
        {message && (
          <div style={{
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            backgroundColor: message.includes('sucesso') ? '#d4edda' : '#f8d7da',
            color: message.includes('sucesso') ? '#155724' : '#721c24',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <section className={styles.card}>
          <div className={styles.profileIconArea}>
            <img
              src="/person-outline.svg"
              alt="Perfil"
              className={styles.profileIcon} />
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
              disabled={saving}
            />
            <label className={styles.label} htmlFor="email">Email</label>
            <input 
              className={styles.input} 
              id="email" 
              type="email" 
              value={email} 
              onChange={handleChange(setEmail)}
              disabled={saving}
            />
            <label className={styles.label} htmlFor="senha">Senha</label>
            <input 
              className={styles.input} 
              id="senha" 
              type="password" 
              value={senha} 
              onChange={handleChange(setSenha)}
              placeholder="Digite a nova senha (opcional)"
              disabled={saving}
            />
            <div className={styles.buttonRow}>
              <button 
                className={styles.editButton} 
                type="submit"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Editar'}
              </button>
              <button 
                className={styles.deleteButton} 
                type="button"
                onClick={handleDeleteClick}
                disabled={saving}
              >
                Excluir
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3>Tem certeza que deseja excluir sua conta?</h3>
            <p>Esta ação não pode ser desfeita.</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleCancelDelete}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 