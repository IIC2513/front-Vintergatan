import { useEffect, useState } from "react";
import axios from "axios";

export default function UserInfo() {
    return (
        <>
        </>
    )
}

useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`)
        .then((response) => {
            const data = response.data[0]
        }).catch((error) => {
            console.log(error);
        })}, []);

function handleChange(nombre) {
    setNombre(nombre);
}