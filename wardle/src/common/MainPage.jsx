import styles from "./MainPage.module.css";
import Navbar from "./NavBar";


export default function MainPage() {
  return (
    <>
      <Navbar />
      <h1>WARdl!</h1>
      <div className={styles.Userinput}>
        <h2>
          <a href="/login" className={styles.register}>Inicia sesión en tu cuenta</a>
          <p>o</p>
          <a href="/register" className={styles.register}>crea una nueva cuenta</a>
        </h2>
      </div>
      <div className={styles.Instructions}>
        <a href="/rules">REGLAS DEL JUEGO</a>
        <a href="/about">CÓMO JUGAR</a>                    
        <a href="/visita">JUGAR COMO VISITA</a>{" "}        {/* todavía no existe la ruta */}
      </div>
    </>
  );
}

/* <form>
          <input
            type="text"
            name="username"
            placeholder="NOMBRE DE USUARIO..."
          />
          <input type="password" name="password" placeholder="CONTRASEÑA..." />
          <button type="submit" className={styles.arrow}>➔</button>
        </form> */