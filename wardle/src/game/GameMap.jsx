import { useState, useEffect } from "react";
import styles from "./GameMap.module.css";
import axios from 'axios';
import PropTypes from 'prop-types';


export default function GameMap({ roomId, players }) {
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Players:', players);

  useEffect(() => {
    const fetchPlayerPoints = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token almacenado
        if (!token) {
          throw new Error('Token no encontrado');
        }
    
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/${roomId}/points`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response)
    
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Error al obtener los datos: ${response.status}`);
        }
    
        setPlayerData(response.data.players);
      } catch (err) {
        console.error("Error en la solicitud:", err);
        setError(err.response?.data?.message || "Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    }
    fetchPlayerPoints();
  }, [roomId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.mapContainer}>
      <h2>Progreso de los Jugadores</h2>
      <div className={styles.map}>
        {playerData.map((player) => (
          <div key={player.name} className={styles.player}>
            <div className={styles.name}>{player.name}</div>
            <div className={styles.progressBarContainer}>
              {/* La barra de progreso toma el tamaño en relación al puntaje */}
              <div
                className={styles.progressBar}
                style={{ width: `${(player.points / 200) * 100}%` }} // Ajusta el ancho de la barra según el puntaje
              ></div>
            </div>
            <div className={styles.points}>{player.points} puntos</div>
          </div>
        ))}
      </div>
    </div>
  );
}

GameMap.propTypes = {
  roomId: PropTypes.any.isRequired, 
  players: PropTypes.any.isRequired, 
};