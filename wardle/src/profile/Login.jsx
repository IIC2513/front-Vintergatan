import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import './Login.css';
import Navbar from '../common/NavBar';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setToken, setName, setEmail } = useContext(AuthContext);
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
      email: email,
      password: password
    }).then((response) => {
      console.log('Login successful');
      setError(false);
      setMsg("Login exitoso!");
      // Recibimos el token y lo procesamos
      const access_token = response.data.access_token;
      setToken(access_token);
      console.log("Se seteo el token: ", access_token);
      setName(response.data.name);
      setEmail(response.data.email);  // Asegúrate de imprimir el token correctamente
      navigate('/');
    }).catch((error) => {
      console.error('An error occurred while trying to login:', error);
      setError(true);  // Aquí puede haber más lógica para tratar los errores
    })
  };

  return (
    <>
    <Navbar />
    <h2>Ingresa tu Usuario</h2>
    <div className="Login">
      {msg.length > 0 && <div className="successMsg"> {msg} </div>}
      {error && <div className="error">Hubo un error con el Login, por favor trata nuevamente.</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmailInput(e.target.value)}
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
        <input type="submit" value="Enviar" />
      </form>
    </div>
    </>
  );
}
