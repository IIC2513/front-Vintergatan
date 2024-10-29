import { useState } from "react";

export default function Usuario() {
    const [nombre, setNombre] = useState(null);

    function handleChange(nombre) {
        setNombre(nombre);
    }

    return (
        <>
        <input
            onChange={e => handleChange(e.target.value)}
        />
        <p>Bienvenid@, { nombre }!</p>
        </>
    )
}