import styles from "./MainPage.module.css";
import Navbar from "./NavBar";


export default function MainPage() {
  return (
    <>
      <Navbar />
      <h1>WARdl!</h1>
      <div className="centered-container">
        <div className={styles.Userinput}>
          <h2 className={styles.title}>Inicia sesión en tu cuenta</h2>
          <form>
            <input
              type="text"
              name="username"
              placeholder="NOMBRE DE USUARIO..."
            />
            <input type="password" name="password" placeholder="CONTRASEÑA..." />
            <button type="submit" className={styles.arrow}>➔</button>
          </form>
          <h2 className={styles.title}>
            <a href="/register" className={styles.register}>o crea una nueva cuenta</a>
          </h2>
        </div>
      </div>
      <div className={styles.Instructions}>
        <a href="/about">CÓMO JUGAR</a>                    
        <a href="/visita">JUGAR COMO VISITA</a>{" "}        {/* todavía no existe la ruta */}
      </div>
    </>
  );
}
