import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { useContext } from 'react';
import styles from './NavBar.module.css';
import axios from 'axios';

export default function Navbar() {
    const { token, logout, name } = useContext(AuthContext);
    const navigate = useNavigate();
    const isAuthenticated = Boolean(token);

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

    const handleExitRoomConfirmation = (event, path) => {
        const roomId = window.location.pathname.split('/')[2]; // Extraer roomId de la URL

        if (window.location.pathname.startsWith('/gameroom')) {
            event.preventDefault();  // Detener la navegación
            const isConfirmed = window.confirm('¿Estás seguro de que quieres salir de la sala? Esta se eliminará.');

            if (isConfirmed) {
                // Eliminar la sala
                deleteRoom(roomId); // Llamar a deleteRoom para eliminar la sala
                navigate(path);  // Redirigir al nuevo destino
            }
        } else {
            navigate(path);  // Si no es una sala, navega normalmente
        }
    };

    const deleteRoom = async (roomId) => {
        const token = localStorage.getItem('token'); // Obtén el token de localStorage

        if (!token) {
            alert('No tienes autorización para eliminar esta sala');
            return;
        }

        const playerInfo = await getPlayerInfoFromToken();
        const playerId = playerInfo?.id;
        console.log("Navbar:", playerId)

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/room/delete/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { playerId },
            });
        } catch (error) {
            console.error(error);
            alert('Error al eliminar la sala');
        }
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo} onClick={(e) => handleExitRoomConfirmation(e, '/')}>Wardl</Link>

            <div className={styles.navLinks}>
                <Link to="/rules" className={styles.navLink} onClick={(e) => handleExitRoomConfirmation(e, '/rules')}>Página de instrucciones</Link>
                <Link to="/about" className={styles.navLink} onClick={(e) => handleExitRoomConfirmation(e, '/about')}>Nosotros</Link>
                <Link to="/room" className={styles.navLink} onClick={(e) => handleExitRoomConfirmation(e, '/room')}>Ir a partida</Link>

                <div className={styles.userMenu}>
                    <button className={styles.userButton}>
                        {isAuthenticated ? name : name}
                    </button>
                    <div className={styles.dropdownContent}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/room" className={styles.dropdownItem} onClick={(e) => handleExitRoomConfirmation(e, '/room')}>Perfil</Link>
                                <button onClick={(e) => {
                                  handleExitRoomConfirmation(e, '/'); // Redirige a la página principal tras cerrar sesión
                                  logout(); // Llama a logout si es necesario después de manejar la sala
                                  }}
                                    className={styles.dropdownItem}
                                >
                                    Cerrar sesión
                                </button>
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
