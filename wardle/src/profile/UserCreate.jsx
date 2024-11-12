import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserCreate.module.css";
import axios from "axios";

export default function UserCreate() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (nombre) => {
    setNombre(nombre);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        name: nombre,
        email: email,
        password: password,
        experience: 0,
        history: "",
      });
      setMessage("Usuario creado con éxito");
    } catch (error) {
      setMessage("Hubo un error al crear el usuario");
      console.error(error);
    }
  };

  return (
    <>
      <header className={styles.header}>WARdl</header>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        ↶
      </button>
      <h1 className={styles.title}>Registro</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="NOMBRE DE USUARIO..."
            value={nombre}
            onChange={(e) => handleChange(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="CORREO ELECTRÓNICO..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="CONTRASEÑA..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.register}>
          Crear Usuario
        </button>
      </form>
      <p>{message}</p>
    </>
  );
}
