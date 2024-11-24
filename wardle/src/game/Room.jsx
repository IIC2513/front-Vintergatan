import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Navbar from "../common/NavBar";
import styles from "./Room.module.css";

export default function Room() {
  const [rooms, setRooms] = useState([]);  // Estado para las salas
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const playerID = localStorage.getItem('playerID');

    if (!token) {
      setError('No estás autenticado');
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/player-rooms/${playerID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Salas desde el backend:', response.data); // Asegúrate de que los datos llegan bien
        setRooms(response.data); // Actualiza el estado de las salas

      } catch (error) {
        setError('Error al obtener las salas');
        console.error(error);
      }
    };

    fetchRooms();


    // Obtener los datos del usuario
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/show`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
          setUserData(response.data);
          localStorage.setItem('playerID', response.data.id); // Guarda el ID si lo necesitas globalmente
      })
      .catch(err => {
          setError('Error al obtener los datos del usuario');
          console.error(err);
      });
    }, []); 

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleJoinRoomBar = async () => {
    const playerID = localStorage.getItem('playerID');
    const roomCode = document.querySelector("input[placeholder='ESCRIBE UN CÓDIGO PARA UNIRTE A OTRA SALA...']").value;

    if (!roomCode) {
      alert("Por favor, ingresa un código de sala.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/room/join`, {
        player_id: playerID,
        room_id: roomCode
      });
      alert(response.data.message);
      navigate(`/room/${roomCode}`);
    } catch (error) {
      console.error(error);
      alert('Error al unirse a la sala.');
    }
  };

  const handleJoinRoom = async (roomCode) => {
    const playerID = localStorage.getItem('playerID');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/room/join`, {
        player_ID: playerID,
        room_ID: roomCode
      });
      alert(response.data.message);
      navigate(`/room/${roomCode}`);
    } catch (error) {
      console.error(error);
      alert('Error al unirse a la sala.');
    }
  };

  const getHostIdFromToken = () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error('No token found');
      return null;
    }

    try {
        const decoded = parseJWT(token);
        console.log(decoded);
        return decoded.sub; // Asegúrate de que `id` existe en tu token
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
  }

  function parseJWT(token) {
    try {
        const base64Payload = token.split('.')[1]; // Obtiene la segunda parte del token
        const payload = atob(base64Payload); // Decodifica la parte Base64
        return JSON.parse(payload); // Parsea el JSON
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
  }
  
  const handleCreateRoom = async () => {
    const token = localStorage.getItem('token'); // Asegúrate de obtener el token
    const host_ID = getHostIdFromToken();  // Obtener el ID del host desde el token
    if (!host_ID) {
        alert('No se pudo obtener el ID del host');
        return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/room/create`, {
        host_ID,  
        map_ID: 1,  
        player_count: 1,  
        status: 'In progress',  
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert(`Sala creada con ID: ${response.data.roomId}`);
      // Redirigir al usuario a la sala recién creada
      navigate(`/room/${response.data.roomId}`);
    } catch (error) {
      console.error(error);
      alert('Error al crear la sala.');
    }
  };

  const startGame = async () => {
    try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/room/${salaId}/start`);
        // Fetch inicial del estado de la sala y tableros
        fetchBoard();
    } catch (error) {
        console.error("Error al iniciar la partida", error);
    }
  };

    if (error) {
      return <div>{error}</div>;
    }
  
    if (!userData) {
      return <div>Cargando...</div>;
    }

    return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <h2>Bienvenid@ {userData.name}</h2>
          <div className={styles.profileImage}>Personaje actual .PNG</div>
          <div className={styles.experienceInfo}>
            <p>Puntos de experiencia: {userData.experience} XP</p>
          </div>
          <button className={styles.button}>Cambiar personaje</button>
          <button className={styles.button}>Editar cuenta</button>
          <button onClick={handleLogout} className={styles.logoutButton}>Cerrar sesión</button>
        </div>

        <div className={styles.rightPanel}>
          <h1>¿Listo para jugar?</h1>
          <div className={styles.row1}>
            <input
              type="text"
              placeholder="ESCRIBE UN CÓDIGO PARA UNIRTE A OTRA SALA..."
              className={styles.inputCode}
            />
            <button className={styles.joinButton} onClick={handleJoinRoomBar}>➔</button>
          </div>

          <div className={styles.roomList}>
            <h2>Salas disponibles</h2>
            <ul>
            {Array.isArray(rooms) && rooms.length > 0 ? (
              rooms.map(room => (
                <li key={room.id}>
                  Sala {room.id} - {room.status}
                  <button onClick={() => handleJoinRoom(room.id)} disabled={room.status === 'Finished'}>{room.status === 'Finished' ? 'Finalizada' : 'Unirse'}</button>
                </li>
              ))
            ) : (
                <li>No hay salas disponibles</li>
            )}
            </ul>
          </div>

          <button onClick={handleCreateRoom} className={styles.createRoomButton}>Crear nueva sala</button>
        </div>
      </div>
    </>
  );
};