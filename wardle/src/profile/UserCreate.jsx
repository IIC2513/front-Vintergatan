import { useState } from "react";
import axios from "axios";
import '../common/index.css';

export default function UserCreate() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

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
            <a href="/">Volver al Inicio</a>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => handleChange(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Crear Usuario</button>
            </form>
            <p>{message}</p>
        </>
    );
}
