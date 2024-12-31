import React, { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { LogadoContext } from "../../context/LogadoContext";
import { useFocusEffect } from "@react-navigation/native";
import { fetchHistorico } from "../../services/userService";
 
// Página com o histórico de transações, dividendos, saques e depósitos
export default HistoricoView = () => {
    const { userId, token } = useContext(LogadoContext);

    const [transacoes, setTransacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const listaHistorico = async () => {
        setError("");

        try {
            const dados = await fetchHistorico(userId, token);

            setTransacoes(dados.transacoes);
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (data) => {
        const date = new Date(data);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = String(date.getFullYear()).slice(-2);
    
    return `${dia}/${mes}/${ano}`;
    };

    const getBackgroundColor = (tipo) => {
        switch (tipo) {
            case "DEPÓSITO":
                return "#d1ecf1";
            case "SAQUE":
                return "#fff3cd"
            case "COMPRA":
                return "#f8d7da";  
            case "VENDA":
                return "#c1e1c1";
            default:
                return "#fff";
        }
    };

    useFocusEffect(
        useCallback(() => {
            listaHistorico();
        },[])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Histórico</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <FlatList 
                    data={transacoes}
                    numColumns={1}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.ativo_container, {backgroundColor: getBackgroundColor(item.tipo) }]}
                        >
                            {item.tipo === "DEPÓSITO" || item.tipo === "SAQUE" ? (
                                <>
                                    <Text style={styles.ativo_tipo}>{item.tipo}</Text>
                                    <Text style={styles.ativo_valor}>R$ {Number(item.valor_total).toFixed(2)}</Text>
                                    <Text style={styles.ativo_quantidade}>{formatDate(item.data)}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.ativo_tipo}>{item.tipo}</Text>
                                    <Text style={styles.ativo_nome}>{item.ativo}</Text>
                                    <Text style={styles.ativo_valor}>R$ {Number(item.mudanca).toFixed(2)}</Text>
                                    <Text style={styles.ativo_data}>{formatDate(item.data)}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.flatlist}
                />
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
    },
    titulo: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        marginBottom: 20,
        color: "#fff",
        marginTop: 15
    },
    flatlist: {
        paddingBottom: 20,
    },
    ativo_container: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minHeight: 80,
    },
    ativo_nome: {
        flex: 2,
        fontSize: 16,
        fontFamily: "Inter",
        color: "#000",
        alignItems: "flex-start",
        justifyContent: "center",
        maxWidth: '25%',
    },
    ativo_tipo: {
        flex: 1,
        fontFamily: "Inter-Bold",
        fontSize: 12,
        alignItems: "flex-start",
        justifyContent: "center",
        maxWidth: '25%',
        color: "#1A1A1A",
    },
    ativo_quantidade: {
        fontSize: 14,
        fontFamily: "Inter",
        color: "#000",
        flex: 1,
        textAlign: 'center',
    },
    ativo_valor: {
        fontSize: 14,
        fontFamily: "Inter",
        color: "#000",
        flex: 1,
        textAlign: 'center',
    },
    ativo_data: {
        flex: 1,
        fontFamily: "Inter",
        textAlign: "right",
    },
    error: {
        color: "red",
        fontSize: 20,
        marginTop: 20,
    },
});