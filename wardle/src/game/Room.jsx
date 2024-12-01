import { useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Navbar from "../common/NavBar";
import styles from "./Room.module.css";

export default function Room() {
  const [rooms, setRooms] = useState([]);  // Estado para las salas
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [characterImage, setCharacterImage] = useState(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const hasRun = useRef(false);

  const getHostIdFromToken = useCallback(() => {
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
  },[]);

//saca estos
  const getPlayerInfoFromToken = useCallback(async () => {
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
        console.log('Respuesta:', response.data)
        return response.data;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
  }, [getHostIdFromToken]);

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

  useEffect(() => {
    if (hasRun.current) return; // Si ya se ejecutó, salir del efecto

    hasRun.current = true;
    
    const token = localStorage.getItem('token');
      
    if (!token) {
      setError('No estás autenticado');
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rooms`, {
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
          localStorage.setItem('userID', response.data.id); // Guarda el ID si lo necesitas globalmente
      })
      .catch(err => {
          setError('Error al obtener los datos del usuario');
          console.error(err);
      });

    const handleCreatePlayer = async () => {
      const token = localStorage.getItem('token');
      const user_ID = getHostIdFromToken();
      
      if (!user_ID) {
        alert('No se pudo obtener el ID del usuario');
        return;
      }
    
      try {
        const checkResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/players/${user_ID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (checkResponse.data) {
          return; // Salir de la función para evitar la creación del jugador
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('No se encontró jugador para este usuario, se creará uno nuevo.');
        } else {
          console.error('Error al verificar el jugador:', error);
          return; // Salir de la función si hubo un error al verificar
        }
      }
    
      try {
        // Crear el jugador si no existe
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/player/create`, {
          user_ID,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error al crear el jugador:', error);
      }
    };

    handleCreatePlayer();

    const fetchCharacterImage = async () => {
      try {
        const playerInfo = await getPlayerInfoFromToken(); // Llama a la función existente
        const characterId = playerInfo.character;
        
        if (characterId) {
          setCharacterImage(`/characters/letter-${characterId}.jpg`);
        } else {
          setError("No se pudo obtener el ID del personaje");
        }
      } catch (err) {
        console.error("Error al obtener datos del jugador:", err);
        setError("Hubo un error al cargar los datos");
      }
    };

    fetchCharacterImage();

    }, [getHostIdFromToken, getPlayerInfoFromToken]); 

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleJoinRoomBar = async () => {
    const playerID = localStorage.getItem('userID');
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
    const playerInfo = await getPlayerInfoFromToken();
    const player_id = playerInfo.id

    console.log("ID jugador:", player_id)
    console.log("Salas:", roomCode)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/room/join`, {
        player_id: player_id,
        room_id: roomCode
      });
      alert(response.data.message);
      navigate(`/gameroom/${roomCode}`);
    } catch (error) {
      console.error(error);
      alert('Error al unirse a la sala.');
    }
  };
  
  const handleCreateRoom = async () => {
    const token = localStorage.getItem('token'); // Asegúrate de obtener el token
    const player_info = await getPlayerInfoFromToken();  // Obtener el ID del host desde el token
    const host_ID = player_info.id
    console.log('Host ID:', host_ID)

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
      navigate(`/gameroom/${response.data.roomId}`);
    } catch (error) {
      console.error(error);
      alert('Error al crear la sala.');
    }
  };

  const getCharacterImage = (characterId) => {
    return `/characters/letter-${characterId}.jpg`;
  };

  const handleChangeCharacter = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/player/update-character`,{},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ); 
      console.log(response.data);
      const newCharacter = response.data.character;
      setCharacterImage(getCharacterImage(newCharacter)); 
    } catch (error) {
      console.error("Error al cambiar el personaje:", error);
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
          <div className={styles.profileImage}>
            <img
              src={characterImage}
              alt="Personaje actual"
              className={styles.characterImage}
            />
          </div>
          <div className={styles.experienceInfo}>
            <p>Puntos de experiencia: {userData.experience} XP</p>
          </div>
          <button className={styles.button} onClick={handleChangeCharacter}>Cambiar personaje</button>
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