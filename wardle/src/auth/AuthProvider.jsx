import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [name, setName] = useState(localStorage.getItem('name') || "Guest");
    const [email, setEmail] = useState(localStorage.getItem('email') || "");

    function logout() {
        setToken(null);
        setName("Guest");
        setEmail("");
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
        }
    }, [token, name, email]);

    return (
        <AuthContext.Provider value={{ token, setToken, logout, name, setName, email, setEmail }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Valida que children sea renderizable
};
