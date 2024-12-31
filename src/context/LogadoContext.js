import React, { createContext, useState } from "react";
import { normalLogin } from "../services/userService.js";
import { createNavigationContainerRef } from "@react-navigation/native";

export const LogadoContext = createContext();

export const navigationRef = createNavigationContainerRef();

export const LogadoContextProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [token, setToken] = useState("");

    const navigate = (name, params) => {
        if (navigationRef.isReady()) {
            navigationRef.navigate(name, params);
        }
    };

    const loginNormal = async (email, senha) => {
        try {
            const response = await normalLogin(email, senha);

            setUserId(response.user.id);
            setUserName(response.user.name);
            setToken(response.token);

            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    };

    const loginGithub = async (data) => {
        try {
            setUserId(data.id);
            setUserName(data.name);
            setToken(data.token);
            
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message }
        }
    };

    const logout = async () => {
        try {
            setUserId(null);
            setUserName(null);
            setToken("");

            return { 
                success: true,
                message: "Aguardamos o seu retorno, até logo!"
            }
        } catch (error) {
            return { 
                success: false,
                message: "Houve um erro na hora de deslogar.",
                error
            }
        }
    };

    return (
        <LogadoContext.Provider value={{ userId, setUserId, userName, token, loginNormal, loginGithub, logout, navigate, navigationRef }}>
            {children}
        </LogadoContext.Provider>
    );
};