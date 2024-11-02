import { useState } from "react";

export default function UserCreate() {
    const [nombre, setNombre] = useState(null);

    function handleChange(nombre) {
        setNombre(nombre);
    }

    return (
        <>
        <a href="/">Volver al Inicio</a>
        <input
            onChange={e => handleChange(e.target.value)}
        />
        <p>Bienvenid@, { nombre }!</p>
        </>
    )
}