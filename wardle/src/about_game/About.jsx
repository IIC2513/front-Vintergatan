import { useNavigate } from 'react-router-dom';
import styles from "./About.module.css";

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <header className={styles.header}>WARdl</header>

      <button onClick={() => navigate('/')} className={styles.backButton}>
        ↶
      </button>

      <h1 className={styles.mainTitle}>¿Qué es esto?</h1>
      <h2 className={styles.text}>
        Este equipo ha creado “WARdl” como un juego estratégico pensado para
        jugar entre 2 y hasta 4 personas, donde tendrán que enfrentarse en
        varias rondas de Wordl, intentando ganar la mayor cantidad de puntos en
        cada ronda. El primero en conseguir 1000 puntos gana la batalla. En los
        partidos, los jugadores pueden jugar con potenciadores que les
        proporcionarán ventajas o arruinarán a su oponente. Para conseguir estos
        potenciadores deberán pagar con monedas que se ganarán durante los
        juegos. ¡Prepárate para todo! Y no te quedes sin palabras de 5 letras.
      </h2>
      <h2 className={styles.text}>
        Esperamos que lo disfrutes. <br /> ~ Gaspar, Axel y Paula.
      </h2>
    </>
  );
}
