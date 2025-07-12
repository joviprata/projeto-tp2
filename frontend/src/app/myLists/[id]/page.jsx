'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../page.module.css';

const listas = [
  {
    id: 1,
    name: 'Lista 1',
    products: ['P1', 'P2'],
  },
  {
    id: 2,
    name: 'Lista 2',
    products: ['P1', 'P2', 'P3'],
  },
  {
    id: 3,
    name: 'Lista 3',
    products: ['P1', 'P2', 'P3', 'P4'],
  },
];

export default function ListaDetalhesPage() {
  const { id } = useParams();
  const router = useRouter();

  const listaId = Number(id);
  const lista = listas.find((l) => l.id === listaId);

  if (!lista) {
    return (
      <div className={styles.container}>
        <h2>Lista não encontrada</h2>
        <button onClick={() => router.back()}>Voltar</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{lista.name}</h1>
      <h3>Produtos:</h3>
      <ul>
        {lista.products.map((prod, idx) => (
          <li key={idx}>{prod}</li>
        ))}
      </ul>
      <button onClick={() => router.back()} className={styles.button}>
        Voltar
      </button>
    </div>
  );
}
