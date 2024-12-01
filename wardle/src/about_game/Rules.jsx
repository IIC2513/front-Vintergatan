import styles from './Rules.module.css';
import tabla1 from './img/tabla1.png';
import tabla2 from './img/tabla2.png';
import tabla3 from './img/tabla3.png';
import { useNavigate } from 'react-router-dom';
import Navbar from "../common/NavBar";


export default function Rules() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <header className={styles.header}>
        <h1 className={styles.h1}>Bienvenido a WARdl</h1>
        <p>El juego estratégico inspirado en Wordle</p>
      </header>
      <div className={styles.panel}>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          ↶
        </button>

        <section className={styles.reglas}>
          <h2 className={styles.h2}>Reglas del juego</h2>
          <p>El juego consiste en una competencia entre dos a cuatro jugadores, que deberán adivinar palabras para acumular puntos y avanzar en el mapa. El primero en alcanzar el puntaje necesario será el ganador.</p>
          <p>En cada turno, el jugador adivina una palabra o usa un &quot;power-up&quot;. La partida termina cuando un jugador adivina una cantidad determinada de palabras.</p>

          <h3 className={styles.h3}>Reglas específicas</h3>
          <ol>
            <li>En su turno, el jugador debe adivinar una palabra existente en la base de datos de su tablero. El servidor compara las letras y asigna colores a las casillas según el resultado (verde, amarillo o gris).</li>
            <li>Los jugadores ganan experiencia, puntos y monedas por cada palabra adivinada. La experiencia permite subir de nivel, los puntos determinan al ganador y las monedas sirven para comprar power-ups.</li>
          </ol>

          <h3 className={styles.h3}>Puntaje</h3>
          <p>Cada jugador gana puntos basados en el color de las letras adivinadas en su intento. El puntaje también disminuye con cada intento adicional. La ecuación es la siguiente:</p>
          <h4 className={styles.ecuacion}>P = (G×1) + (A×3) + (V×5) − (I×0.5)</h4>
          <p>Donde:</p>
          <ul>
            <li><b>P</b> es el puntaje total.</li>
            <li><b>G</b> es la cantidad de letras grises.</li>
            <li><b>A</b> es la cantidad de letras amarillas.</li>
            <li><b>V</b> es la cantidad de letras verdes.</li>
            <li><b>I</b> es el número de intentos.</li>
          </ul>

          <h3 className={styles.h3}>Experiencia</h3>
          <p>Al final de cada juego, el jugador acumula puntos de experiencia según su desempeño.</p>
          <h4 className={styles.ecuacion}>E = P + (W×B)</h4>
          <p>Donde:</p>
          <ul>
            <li><b>E</b> es la experiencia ganada en el juego.</li>
            <li><b>P</b> es el puntaje total.</li>
            <li><b>W</b> es una variable booleana que vale 1 si el jugador ganó la partida, y 0 si no ganó.</li>
            <li><b>B</b> es el bono por la victoria, que esta configurado en 100.</li>
          </ul>

          <h3 className={styles.h3}>Personajes y Power-ups</h3>
          <p>Existen cinco personajes: W, O, R, D y L, con distintas probabilidades de obtener power-ups. El jugador puede comprar estos power-ups usando monedas ganadas en el juego.</p>

          <h4 className={styles.h4}>Lista de Power-ups:</h4>
          <ul>
            <li><b>Hint:</b> Revela una letra que no pertenece a la palabra.</li>
            <li><b>Letra 1.0:</b> Muestra una letra que pertenece a la palabra (sin indicar su posición).</li>
            <li><b>Letra 2.0:</b> Revela una letra y su posición exacta.</li>
            <li><b>Esconder:</b> Oculta pistas del oponente al poner sus líneas en gris.</li>
            <li><b>Bloqueo:</b> Bloquea el resultado de dos letras del próximo intento del oponente.</li>
          </ul>

          <h4 className={styles.h4}>Tabla de Costos de Letras</h4>
          <img src={tabla1} alt="Tabla de Costos de Letras" className={styles.tabla} />

          <h4 className={styles.h4}>Tabla de Precios de Power-ups</h4>
          <img src={tabla2} alt="Tabla de Precios de Power-ups" className={`${styles.tabla} ${styles['tabla-pequena']}`} />

          <h4 className={styles.h4}>Probabilidades de Power-ups por Personaje</h4>
          <img src={tabla3} alt="Tabla de Probabilidades" className={styles.tabla} />
        </section>
      </div>
    </>
  );
}
