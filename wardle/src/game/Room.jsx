import React from "react";
import styles from "./Room.module.css";

export default function Room() {
  const usuario = "usuario"; //cambiar por el nombre de usuario
  const experience = 230; //cambiar por la experiencia del usuario
  const player1 = "Gasparo420"; //cambiar por el nombre de usuario
  const player2 = "Sr.Åberg"; //cambiar por el nombre de usuario
  const player3 = "Paulina42"; //cambiar por el nombre de usuario

  return (
    <div className={styles.container}>
      {/* <header className={styles.header}>
        <h1>WARdl</h1>
      </header>
      <button className={styles.backButton}>↶</button>
 */}
      <div className={styles.leftPanel}>
        <h2>Bienvenido @{usuario}</h2>
        <div className={styles.profileImage}>Personaje actual .PNG</div>
        <div className={styles.experienceInfo}>
          <p>Puntos de experiencia: {experience} XP</p>
        </div>

        <button className={styles.button}>Cambiar personaje</button>
        <button className={styles.button}>Editar cuenta</button>
        <button className={styles.logoutButton}>Salir de la sesión</button>
      </div>


      <div className={styles.rightPanel}>
        <h1>¿Listo para jugar?</h1>
        <div className={styles.row1}>
        <input
          type="text"
          placeholder="ESCRIBE UN CÓDIGO PARA UNIRTE A OTRA SALA..."
          className={styles.inputCode}
        />
        <button className={styles.joinButton}>➔</button>
            </div>

        {/* <div className={styles.codeRow}>
          <h2>Administra tu sala</h2>
          <div className={styles.roomCode}>CÓDIGO: #1234</div>
        </div>

        <div className={styles.adminPanel}>
          <label className={styles.toggle}>
            Power-Ups
            <input type="checkbox" />
            <span className={styles.slider}></span>
          </label>
          <ul className={styles.playersList}>
            <li>
              {player1} <button className={styles.removeButton}>X</button>
            </li>
            <li>
              {player2} <button className={styles.removeButton}>X</button>
            </li>
            <li>
              {player3} <button className={styles.removeButton}>X</button>
            </li>
          </ul>
          <button className={styles.startButton}>COMIENZA</button>
          <footer className={styles.footer}>
            <h3>
              <a href="/partidas">Revisa tu historial de partidas</a>
            </h3>
          </footer>
        </div> */}
      </div>
    </div>
  );
}
