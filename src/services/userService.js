import axios from "axios";
import { SERVER_URL } from "@env";

// Cadastro de usuário
export const registerUser = async (user) => {
    try {
        const response = await axios.post(`${SERVER_URL}/users/create`, user);
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Login convencional
export const normalLogin = async (email, senha) => {
    try {
        const response = await axios.post(`${SERVER_URL}/auth/login`, {
            email: email,
            senha: senha
        });
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Busca saldo do usuário
export const fetchSaldo = async (id, token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data.saldo;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Busca valor investido pelo usuário
export const fetchValorInvestido = async (id, token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data.valor_investido
    } catch (error) {
        throw new Error(error.message);
    }
};

// Busca histórico de movimentações do usuário
export const fetchHistorico = async (id, token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/users/hist/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Adiciona saldo ao usuário (depósito / venda de ativos)
export const adicionaSaldo = async (id, quantia, token) => {
    try {
        const response = await axios.post(`${SERVER_URL}/users/add/${id}`, { quantia }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;    
    } catch (error) {
        throw new Error(error.message);
    }
};

// Remove saldo do usuário (saque / compra de ativos)
export const removeSaldo = async (id, quantia, token) => {
    try {
        const response = await axios.post(`${SERVER_URL}/users/remove/${id}`, { quantia }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};