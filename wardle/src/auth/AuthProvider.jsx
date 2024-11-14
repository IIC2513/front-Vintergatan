import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [name, setName] = useState("Guest");
    const [email, setEmail] = useState("");

    function logout() {
        setToken(null);
        setName("Guest");
        setEmail("");
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, logout, name, setName, email, setEmail }}>
            {children}
        </AuthContext.Provider>
    );
}
