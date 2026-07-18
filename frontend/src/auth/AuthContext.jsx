import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        const { token: newToken, role: newRole } = data;

        localStorage.setItem("token", newToken);
        localStorage.setItem("role", newRole);
        setToken(newToken);
        setRole(newRole);

        return newRole;
    };

    const register = async (name, email, password, selectedRole) => {
        await authService.register(name, email, password, selectedRole);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{ token, role, isAuthenticated, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}