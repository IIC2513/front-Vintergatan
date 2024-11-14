import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import styles from './NavBar.module.css';

export default function Navbar() {
  const { token, logout, name } = useContext(AuthContext);
  const isAuthenticated = Boolean(token);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>Wardl</Link>

      <div className={styles.navLinks}>
        <Link to="/rules" className={styles.navLink}>Página de instrucciones</Link>
        <Link to="/about" className={styles.navLink}>Nosotros</Link>
        <Link to="/game" className={styles.navLink}>Ir a partida</Link>

        <div className={styles.userMenu}>
          <button className={styles.userButton}>
            {isAuthenticated ? name : "Usuario"}
          </button>
          <div className={styles.dropdownContent}>
            {isAuthenticated ? (
              <>
                <Link to="/room" className={styles.dropdownItem}>Perfil</Link>
                <button onClick={logout} className={styles.dropdownItem}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.dropdownItem}>Login</Link>
                <Link to="/register" className={styles.dropdownItem}>Registro</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
