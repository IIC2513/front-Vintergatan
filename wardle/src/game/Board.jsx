import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Asegúrate de importar useParams
import './Board.css';
import Navbar from "../common/NavBar";


const Board = () => {
    // Obtener salaId y playerId de los parámetros de la URL
    const { salaId, playerId } = useParams();
    
    const [matrix, setMatrix] = useState(Array(6).fill(Array(5).fill("")));
    const [currentAttempt, setCurrentAttempt] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [palabraAdivinada, setPalabraAdivinada] = useState("");

 
        
    const handleInputChange = (rowIndex, colIndex, value) => {
        console.log(`Cambiando celda: Fila ${rowIndex}, Columna ${colIndex}, Valor: ${value}`);
        if (value.length > 1) return;
        const newMatrix = [...matrix];
        newMatrix[rowIndex] = [...newMatrix[rowIndex]]; // Clonar la fila específica
        newMatrix[rowIndex][colIndex] = value.toUpperCase(); // Convertir a mayúscula si quieres
        setPalabraAdivinada(value); // Obtén el valor del input y actualiza el estado
        setMatrix(newMatrix);
        console.log("Matriz actualizada: ", newMatrix);

    };

    const handleEnter = (rowIndex, colIndex) => {
        
        const nextId = `input-${rowIndex}-${colIndex + 1}`;
        console.log('nextId:', nextId);
        if (colIndex < 4) {  
            const nextInput = document.getElementById(`input-${rowIndex}-${colIndex + 1}`);
            if (nextInput) {
                nextInput.focus(); 
            }
        }
    };

    async function handleGuessSubmit(intentoData) {
        console.log(`Enviando intento para la fila ${currentAttempt}`);
        console.log(JSON.stringify(intentoData))
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/sala/${salaId}/${playerId}/adivinar-palabra`,
                {palabra: palabraAdivinada}
            );
            return response.data;
        } catch (error) {
            console.error("Error al adivinar palabra:", error);
            throw error;
        }
    }

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
                                type="text"
                                maxLength="1"
                                className={`cell ${getColorClass(cell)}`}
                                value={matrix[rowIndex][colIndex]}
                                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                onKeyDown={(e) => {if (e.key === "Enter") {
                                    e.preventDefault();  
                                    handleEnter(rowIndex, colIndex);  
                                }}}
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
    if (cell.startsWith("G")) return "gray";
    if (cell.startsWith("V")) return "green";
    if (cell.startsWith("A")) return "yellow";
    return "";
};

export default Board;
