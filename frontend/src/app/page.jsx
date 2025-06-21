import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Global Market</h1>
      </header>

      <div className={styles.formContainer}>
        <input className={styles.input} type="email" placeholder="E-mail" />
        <input className={styles.input} type="password" placeholder="Senha" />
        <button className={styles.button} >Fazer login</button>
        <p className= {styles.bruno}>
          Não possui conta? <a href="#">clique aqui</a>
        </p>
      </div>
    </div>
  );
}
