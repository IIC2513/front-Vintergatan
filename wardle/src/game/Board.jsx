import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Board.css";

const Board = () => {
  //const { roomId, playerId } = useParams();
  const { roomId, playerId } = useState("");
  const [matrix, setMatrix] = useState(Array(6).fill(Array(5).fill(""))); // Tablero
  const [currentAttempt, setCurrentAttempt] = useState(1); // Intento actual
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const [secretWord, setSecretWord] = useState(""); // Palabra secreta
  const [colorsMatrix, setColorsMatrix] = useState(
    Array(6).fill(Array(5).fill(""))
  );

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

const getRoomId = async (playerId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/player/rooms/${playerId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log("Respuesta de getRoomId:", response.data);

        const rooms = response.data; // Ahora es una lista de salas
        if (rooms.length === 0) {
            throw new Error("El jugador no tiene salas asociadas.");
        }

        // Accede al ID de la sala correctamente desde rooms[0].room.id
        const roomId = rooms[0].room.id;
        console.log("Room ID recuperado:", roomId);
        return roomId;
    } catch (error) {
        console.error("Error al obtener roomId:", error);
        throw new Error("No se pudo obtener el roomId");
    }
};


  /* // Inicializar palabra secreta al montar el componente
  const hasRun1 = useRef(false);
  useEffect(() => {
    if (hasRun1.current) return; // Si ya se ejecutó, salir del efecto
    hasRun1.current = true;
    const randomWord = getRandomWord();
    setSecretWord(randomWord);
    console.log("Palabra secreta:", randomWord); // Elimina el print para la versión final
   }, []); */

  useEffect(() => {
  
    const startGame = async () => {
      try {
        const token = localStorage.getItem('token');
        const playerInfo = await getPlayerInfoFromToken();
        const playerId = playerInfo.id;
        const roomId = await getRoomId(playerId);
        console.log("testses")
        console.log("playerId es: ", playerId);
        console.log("roomId es:" , roomId);
        
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/game/start-game`, {
          playerId: playerId, // ID del jugador
          roomId: roomId,     // ID de la sala
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
        console.log("playerId es: ", playerId);
        console.log("roomId es:" , roomId);
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
  
  

  useEffect(() => {
    // Mover el foco al primer input de la nueva fila cuando cambie currentAttempt
    const nextInput = document.getElementById(`input-${currentAttempt - 1}-0`);
    if (nextInput) {
        nextInput.focus();
    }
  }, [currentAttempt]); // Ejecutar este efecto cada vez que currentAttempt cambie

const handleGuessSubmit = async () => {
    const token = localStorage.getItem("token");
    const rowIndex = currentAttempt - 1; // Fila actual
    const currentWord = matrix[rowIndex].join(""); // Palabra ingresada
    const playerInfo = await getPlayerInfoFromToken();
    const playerId = playerInfo.id;

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
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
