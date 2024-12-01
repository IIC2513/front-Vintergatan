import { useState, useEffect } from "react";
import axios from "axios";

export default function UserInfo() {
    const [nombre, setNombre] = useState(''); // Definir el estado 'nombre'

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`)
            .then((response) => {
                const data = response.data[0]; // Se puede usar la variable 'data' si es necesario
                console.log(data); // Ejemplo de cómo usarla
            })
            .catch((error) => {
                console.log(error);
            });
    }, []); 

    function handleChange(event) {
        setNombre(event.target.value);
    }

    return (
        <div>
            <input 
                type="text" 
                value={nombre} 
                onChange={handleChange} 
                placeholder="Ingrese su nombre"
            />
            <p>Nombre: {nombre}</p>
        </div>
    );
}
