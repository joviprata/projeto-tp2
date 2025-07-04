import styles from './page.module.css';

export default function Perfil() {
  return (
    <div className={styles.containerGeral}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <img src="/Global_Market_Logo.png" alt="Logo" className={styles.logo} />
          <span className={styles.logoText}>Global Market</span>
        </div>
        <div className={styles.headerIcons}>
        </div>
      </header>
      <main className={styles.main}>
        <h2 className={styles.title}>Dados do perfil</h2>
        <div className={styles.profileBox}>
          <div className={styles.userIconBig}></div>
          <form className={styles.form}>
            <label>Nome
              <input type="text" value="" disabled className={styles.input} />
            </label>
            <label>Email
              <input type="email" value="" disabled className={styles.input} />
            </label>
            <label>Senha
              <input type="password" value="" disabled className={styles.input} />
            </label>
            <div className={styles.buttonRow}>
              <button type="button" className={styles.editButton} disabled>Editar</button>
              <button type="button" className={styles.deleteButton}>Excluir</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}