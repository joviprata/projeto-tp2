'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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
        <input className={styles.input} type="email" placeholder="E-mail" />
        <input className={styles.input} type="password" placeholder="Senha" />
        <button className={styles.button}>Fazer login</button>
        <p className= {styles.bruno}>
          Não possui conta? <a href="/cadastro" onClick={cadRedirect}>clique aqui</a>
        </p>
      </div>
    </div>
  );
}
