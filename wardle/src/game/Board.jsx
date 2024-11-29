import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Board.css";
import Navbar from "../common/NavBar";

const Board = () => {
  const { salaId, playerId } = useParams();
  const [matrix, setMatrix] = useState(Array(6).fill(Array(5).fill(""))); // Tablero
  const [currentAttempt, setCurrentAttempt] = useState(1); // Intento actual
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const [secretWord, setSecretWord] = useState(""); // Palabra secreta
  const [colorsMatrix, setColorsMatrix] = useState(
    Array(6).fill(Array(5).fill(""))
  ); // Colores de las celdas

  // Manejar cambio en las celdas

  const handleInputChange = (rowIndex, colIndex, value) => {
    if (value.length > 1) return; // Evitar más de una letra
    const newMatrix = [...matrix];
    newMatrix[rowIndex] = [...newMatrix[rowIndex]];
    newMatrix[rowIndex][colIndex] = value.toUpperCase();
    setMatrix(newMatrix);

    // Mover al siguiente input automáticamente
    if (value && colIndex < 4) { // Si no estamos en la última columna
        const nextInput = document.getElementById(`input-${rowIndex}-${colIndex + 1}`);
        if (nextInput) {
            nextInput.focus();
        }
    }
  };
  useEffect(() => {
    console.log("Player ID desde useParams:", playerId);
    console.log("Room ID desde useParams:", salaId);
  
    const startGame = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/game/start-game`, {
          playerId: playerId, // ID del jugador
          roomId: salaId,     // ID de la sala
        });
        console.log("Respuesta de start-game:", response.data);
        setSecretWord(response.data.secretWord); // Almacena la palabra secreta
        console.log(secretWord);
      } catch (error) {
        console.error("Error al iniciar el juego:", error);
        setErrorMessage("Error al inicializar el juego.");
      }
    };
  
    startGame();
  }, []);
  

  useEffect(() => {
    // Mover el foco al primer input de la nueva fila cuando cambie currentAttempt
    const nextInput = document.getElementById(`input-${currentAttempt - 1}-0`);
    if (nextInput) {
        nextInput.focus();
    }
}, [currentAttempt]); // Ejecutar este efecto cada vez que currentAttempt cambie


const handleGuessSubmit = async () => {
    const rowIndex = currentAttempt - 1; // Fila actual
    const currentWord = matrix[rowIndex].join(""); // Palabra ingresada

    if (currentWord.length < 5) {
        setErrorMessage("Debes completar la fila antes de enviar.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
    }

    const updatedColorsMatrix = [...colorsMatrix];
    updatedColorsMatrix[rowIndex] = calculateColors(currentWord, secretWord);
    setColorsMatrix(updatedColorsMatrix);

    // Enviar la palabra adivinada al backend
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/game/adivinar-palabra`,
            {
                player_id: playerId, // ID del jugador
                attempt: currentAttempt, // Intento actual
                matrix, // Matriz actualizada
            }
        );
        console.log("Palabra enviada al backend:", currentWord);
        console.log("Respuesta del servidor:", response.data);
    } catch (error) {
        console.error("Error al enviar la palabra al backend:", error);
        setErrorMessage("Error al guardar el intento en el servidor.");
        setTimeout(() => setErrorMessage(""), 3000);
    }

    if (currentWord === secretWord) {
        setTimeout(() => alert("¡Correcto!"), 100);
    } else if (currentAttempt < 6) {
        setCurrentAttempt(currentAttempt + 1); // Actualiza el intento actual
    } else {
        setTimeout(() => alert(`Has perdido. La palabra era: ${secretWord}`), 100);
    }
};




  const calculateColors = (guess, secret) => {
    const result = Array(5).fill("grey"); // Por defecto, todas las letras son incorrectas
    const secretLetters = secret.split("");

    // Letras en posición correcta (verde)
    guess.split("").forEach((letter, index) => {
        if (letter === secretLetters[index]) {
            result[index] = "green";
            secretLetters[index] = null; // Marca como usada
        }
    });

    // Letras en posición incorrecta pero presentes (amarillo)
    guess.split("").forEach((letter, index) => {
        if (result[index] === "grey" && secretLetters.includes(letter)) {
            result[index] = "yellow";
            secretLetters[secretLetters.indexOf(letter)] = null; // Marca como usada
        }
    });

    return result; // Regresa la matriz de colores
};



  const getColorClass = (rowIndex, colIndex) => {
    const color = colorsMatrix[rowIndex][colIndex]; // Colores según la matriz
    if (color === "green") return "green";
    if (color === "yellow") return "yellow";
    if (color === "grey") return "grey";
    return "white"; // Por defecto, blanco
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
                  className={`cell ${getColorClass(rowIndex, colIndex)} ${
                    rowIndex >= currentAttempt ? "white" : ""
                  }`}
                  value={matrix[rowIndex][colIndex]}
                  onChange={(e) =>
                    handleInputChange(rowIndex, colIndex, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleGuessSubmit();
                    }
                    if (e.key === "Backspace" && colIndex > 0) {
                      const previousInput = document.getElementById(
                        `input-${rowIndex}-${colIndex - 1}`
                      );
                      if (previousInput) {
                        previousInput.focus();
                      }
                    }
                  }}
                  disabled={rowIndex !== currentAttempt - 1} // Habilitar solo fila activa
                />
              ))}
            </div>
          ))}
        </div>
        <button onClick={() => handleGuessSubmit()}>Enviar intento</button>
        </div>
    </>
  );
};

export default Board;
