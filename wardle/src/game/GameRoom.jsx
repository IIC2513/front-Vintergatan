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

    // Función para eliminar la sala
    const deleteRoom = async (roomId) => {
        if (!token) {
            alert('No tienes autorización para eliminar esta sala');
            return;
        }

        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/room/delete/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
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
