import React, { useContext, useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Navbar from "../common/NavBar";
import GameMap from "./GameMap";
import Board from "./Board.jsx";
import styles from "../common/MainPage.module.css";

export default function GameRoom() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();
    const { token, name } = useContext(AuthContext);
    const [players, setPlayers] = useState([]);
    const [boards, setBoards] = useState([]); // Tableros de todos los jugadores
    const [currentPlayer, setCurrentPlayer] = useState(null); // Jugador actual  

    const hasRun = useRef(false);

    const getHostIdFromToken = () => {
        const token = localStorage.getItem('token'); 
        if (!token) {
          console.error('No token found');
          return null;
        }
        console.log("se llega a este punto")
    
        try {
            const decoded = parseJWT(token);
            console.log(decoded);
            return decoded.sub; // Asegúrate de que `id` existe en tu token
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };
    
    const getPlayerInfoFromToken = async () => {
        const user_id = getHostIdFromToken();
        console.log('User ID:', user_id)
        if (!user_id) {
          console.error('Error al encontrar el ID del usuario');
          return null;
        }
    
        const token = localStorage.getItem('token');  // Obtener el token desde localStorage

        if (!token) {
            console.error('No se encontró el token');
            return null;
        }
    
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/players/${user_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            console.log(response)
            console.log('Respuesta:', response.data)
            return response.data;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };
    
    function parseJWT(token) {
        try {
            const base64Payload = token.split('.')[1]; // Obtiene la segunda parte del token
            const payload = atob(base64Payload); // Decodifica la parte Base64
            return JSON.parse(payload); // Parsea el JSON
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    };

    // Función para eliminar la sala
    const deleteRoom = async (roomId) => {
        if (!token) {
            alert('No tienes autorización para eliminar esta sala');
            return;
        }

        const playerInfo = await getPlayerInfoFromToken();
        const playerId = playerInfo?.id;
        console.log(playerInfo)

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/room/delete/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { playerId },
            });
            alert(response.data.message || 'Sala eliminada exitosamente.');
            navigate('/');
        } catch (error) {
            console.error('Error al eliminar la sala:', error);
            alert('No se pudo eliminar la sala.');
        }
    };

    const handleExitRoom = () => {
        const isConfirmed = window.confirm('¿Estás seguro de que quieres salir de la sala? Esta se eliminará.');
        if (isConfirmed) {
            console.log("se intenta borrar")
            deleteRoom(roomId);
        } else {
            window.history.pushState({}, '', location.pathname);
        }
    };

    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/room/${roomId}`);
                setBoards(response.data.boards); // Supón que boards contiene todos los tableros
                setCurrentPlayer(response.data.currentPlayer); // Supón que currentPlayer es el ID del jugador activo
            } catch (error) {
                console.error("Error al obtener el estado del juego:", error);
            }
        };
      
        fetchGameState();
        const interval = setInterval(fetchGameState, 3000); // Actualiza cada 3 segundos
      
        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, [roomId]);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const createPlayerBoard = async () => {
            const playerInfo = await getPlayerInfoFromToken();
            const playerId = playerInfo?.id;
            console.log(playerInfo)
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/game/${roomId}/join`, 
                    { playerId }, // Enviar el ID del jugador en el cuerpo de la solicitud
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
                        },
                    });
                console.log(response)
                console.log('Tablero creado:', response.data);
            } catch (error) {
                console.error('Error al crear tablero:', error);
            }
        };
        createPlayerBoard();
    }, []);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/room/players/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPlayers(response.data); // Almacenar el array completo de jugadores
            } catch (error) {
                console.error("Error al obtener jugadores de la sala:", error);
            }
        };

        fetchPlayers();
    }, [roomId, token]);

    return (
        <div>
            <Navbar />
            <h1>Sala {roomId}</h1>
            <div className={styles.boardsContainer}>
                {players.map((playerRoom, index) => (
                    <Board
                        key={index}
                        boardData={[]} // Si tienes datos específicos para el tablero, pásalos aquí
                        isCurrent={false} // Ajusta esta lógica si necesitas indicar el tablero actual
                        playerName={`Jugador ${playerRoom.Player.character}`} // Ejemplo: "Jugador R"
                        points={playerRoom.Player.points} // Mostrar puntos si es necesario
                    />
                ))}
            </div>
            <GameMap roomId = {roomId} players={players} />
            <button className={styles.botonabandonar} onClick={handleExitRoom}>Abandonar Juego</button>
        </div>
    );
}
