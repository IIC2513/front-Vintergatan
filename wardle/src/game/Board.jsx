import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Board.css";
import Navbar from "../common/NavBar";
import { getRandomWord } from "../words/words";

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

  // Axel: Cambia a pasar al siguiente celda
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


  // Inicializar palabra secreta al montar el componente
  useEffect(() => {
    const randomWord = getRandomWord();
    setSecretWord(randomWord);
    console.log("Palabra secreta:", randomWord); // Elimina el print para la versión final
  }, []);

  useEffect(() => {
    // Mover el foco al primer input de la nueva fila cuando cambie currentAttempt
    const nextInput = document.getElementById(`input-${currentAttempt - 1}-0`);
    if (nextInput) {
        nextInput.focus();
    }
}, [currentAttempt]); // Ejecutar este efecto cada vez que currentAttempt cambie


  const handleGuessSubmit = () => {
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

    if (currentWord === secretWord) {
        setTimeout(() => alert("¡Correcto!"), 100); 
        // Envia la información al backend

    } else if (currentAttempt < 6) {
        setCurrentAttempt(currentAttempt + 1); // Actualiza el intento actual
    } else {
        setTimeout(() => alert(`Has perdido. La palabra era: ${secretWord}`), 100);
      
        // Envia la información al backend
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
