import React, { useState, useContext } from 'react';
import axios from 'axios';
import './Login.css';
import Navbar from '../common/NavBar';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

export default function UserCreate() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [msg, setMsg] = useState("");

    const { setToken, setName, setEmail: setAuthEmail } = useContext(AuthContext); // Contexto de autenticación
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, {
            name: username,
            email: email,
            password: password,
            experience: 0,
            history: ''
        }).then((response) => {
            console.log('Registro exitoso! Usuario autenticado automáticamente.');

            // Procesar el token y almacenar en el contexto
            const { access_token, name, email } = response.data;
            setToken(access_token);
            setName(name);
            setAuthEmail(email);

            setError(false);
            setMsg('Registro exitoso! Usuario autenticado automáticamente.');
            navigate('/'); // Redirige al inicio
        }).catch((error) => {
            console.error('Ocurrió un error:', error);
            setError(true); // Lógica de errores
        });
    };

    return (
        <>
            <Navbar />
            <h2>Registrar Usuario</h2>
            <div className="Login">
                {msg.length > 0 && <div className="successMsg"> {msg} </div>}
                {error && <div className="error">Hubo un error con el Registro, por favor trata nuevamente.</div>}
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    );
}
