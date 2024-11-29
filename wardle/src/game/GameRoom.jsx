import React, { useContext, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Navbar from "../common/NavBar";
import styles from "./Room.module.css";

export default function GameRoom() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const location = useLocation();
    const { token } = useContext(AuthContext);

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
        const player_id = playerInfo?.id;

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/room/delete/${roomId}`, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    player_id
                }
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
            deleteRoom(roomId);
        } else {
            window.history.pushState({}, '', location.pathname);
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Sala {roomId}</h1>
            <button onClick={handleExitRoom}>Exit</button>
        </div>
    );
}
