import axios from "axios";
import { SERVER_URL } from "@env";

export const buscaAtivos = async (token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/ativos/fetch`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const buscaUserAtivos = async (id, token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/ativos/fetch/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("Sua carteira está vazia!");
        } else {
            throw new Error(error.message);
        }
    }
};

export const compraAtivos = async (ativo, quantidade, userid, token) => {
    const { simbolo, valor, tipo, logo } = ativo;
    try {
        const response = await axios.post(`${SERVER_URL}/ativos/buy`, {
            simbolo,
            quantidade, 
            valor, 
            tipo,
            logo,
            userid
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const vendeAtivos = async (ativoParam, quantidade, userid, token) => {
    const { ativo, valor_compra } = ativoParam;

    try {
        const response = await axios.post(`${SERVER_URL}/ativos/sell`, {
            ativo,
            valor_compra,
            quantidade,
            userid
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const atualizaFavorito = async (id, estado, token) => {
    try {
        const response = await axios.put(`${SERVER_URL}/ativos/fav/${id}`, { estado }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const buscaComposicaoCarteira = async (id, token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/ativos/fetch/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const ativos = response.data;

        const totalAcoes = ativos
            .filter((ativo) => ativo.tipo === "stock")
            .reduce((total, ativo) => total + ativo.quantidade, 0);

        const totalFundos = ativos
            .filter((ativo) => ativo.tipo === "fund")
            .reduce((total, ativo) => total + ativo.quantidade, 0);

        return [
            {
                value: totalAcoes,
                label: "Ações",
                color: "#24f07d"
            },
            {
                value: totalFundos,
                label: "Fundos",
                color: "#f0a524"
            }
        ];
    } catch (error) {
        if (error.response.status === 404) {
            throw new Error("Sua carteira está vazia!");
        } else {
            throw new Error(error.message);
        }
    }
};

export const buscaEvolucaoSaldo = async (id, token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/ativos/fetch/evolution/balance/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error.response.status === 500) {
            throw new Error("Você não possui movimentações ainda.");
        } else {
            throw new Error(error.message);
        }
    }
};

export const buscaEvolucaoValorInvestido = async (id, token) => {
    try {
        const response = await axios.get(`${SERVER_URL}/ativos/fetch/evolution/invested/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error.response.status === 500) {
            throw new Error("Você não possui movimentações ainda.");
        } else {
            throw new Error(error.message);
        }
    }
};