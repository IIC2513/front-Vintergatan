import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simula autenticación
  const [username, setUsername] = useState("Guest"); // Nombre de usuario por defecto

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUsername("Usuario123"); // Simula un nombre de usuario cuando el usuario inicia sesión
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("Guest");
  };

  return (
    <nav className={styles.navbar}>

      <Link to="/" className={styles.logo}>Wardl</Link>

      <div className={styles.navLinks}>
        <Link to="/rules" className={styles.navLink}>Página de instrucciones</Link>
        <Link to="/about" className={styles.navLink}>Nosotros</Link>
        <Link to="/game" className={styles.navLink}>Ir a partida</Link>

        <div className={styles.userMenu}>
          <button className={styles.userButton}>
            {isAuthenticated ? username : "Usuario"}
          </button>
          <div className={styles.dropdownContent}>
            {isAuthenticated ? (
              <button onClick={handleLogout} className={styles.dropdownItem}>Cerrar sesión</button>
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
