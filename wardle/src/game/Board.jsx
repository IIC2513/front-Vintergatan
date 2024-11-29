import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './Board.css';
import Navbar from "../common/NavBar";

const Board = () => {
    const { salaId, playerId } = useParams();
    const [matrix, setMatrix] = useState(Array(6).fill(Array(5).fill("")));
    const [currentAttempt, setCurrentAttempt] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (rowIndex, colIndex, value) => {
        if (value.length > 1) return;  // Evitar más de una letra
        const newMatrix = [...matrix];
        newMatrix[rowIndex] = [...newMatrix[rowIndex]];
        newMatrix[rowIndex][colIndex] = value.toUpperCase();
        setMatrix(newMatrix);
    };

    const handleEnter = (rowIndex, colIndex) => {
        if (colIndex < 4) {
            const nextInput = document.getElementById(`input-${rowIndex}-${colIndex + 1}`);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleGuessSubmit = async () => {
        const playerID = localStorage.getItem("playerID");
        const attemptData = {
            player_id: playerID,
            attempt: currentAttempt,
            matrix: matrix,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/adivinar-palabra`,
                { data: attemptData },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            const { attempt: newAttempt, matrix: updatedMatrix, score } = response.data;

            setMatrix(updatedMatrix);
            setCurrentAttempt(newAttempt);
        } catch (error) {
            console.error(error.response?.data?.message || 'Error al enviar el intento');
            setErrorMessage("Error al procesar la adivinanza.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                {errorMessage && <div className="popup">{errorMessage}</div>}    
                <div className="board">
                    {matrix.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => (
                                <input
                                    key={colIndex}
                                    id={`input-${rowIndex}-${colIndex}`}
                                    type="text"
                                    maxLength="1"
                                    className={`cell ${getColorClass(cell)}`}
                                    value={matrix[rowIndex][colIndex]}
                                    onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleEnter(rowIndex, colIndex);
                                        }
                                    }}
                                    disabled={rowIndex !== currentAttempt - 1}  
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <button onClick={handleGuessSubmit}>Enviar intento</button>
            </div>
        </>
    );
};

const getColorClass = (cell) => {
    if (cell === "V") return "green";  // Asegúrate de asignar el color correcto
    if (cell === "G") return "gray";
    if (cell === "A") return "yellow";
    return "";
};

export default Board;
