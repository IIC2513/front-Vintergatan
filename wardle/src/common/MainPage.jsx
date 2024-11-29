import styles from "./MainPage.module.css";
import Navbar from "./NavBar";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";


export default function MainPage() {
  const { token } = useContext(AuthContext); // Obtener el token del contexto
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (token) {
      navigate("/room"); // Redirige a /room si está autenticado
    } else {
      navigate("/login"); // Redirige a /register si no está autenticado
    }
  };

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
        <a onClick={handlePlayClick} className={styles.register}>
          COMIENZA A JUGAR
        </a>
        <a href="/rules">REGLAS DEL JUEGO</a>                    
        <a href="/about">CONOCE AL EQUIPO</a>{" "}        {/* todavía no existe la ruta */}
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