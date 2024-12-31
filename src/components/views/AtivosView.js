import React, { useCallback, useContext, useState } from "react";
import { Alert, FlatList, StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import { buscaAtivos, compraAtivos } from "../../services/ativoService.js";
import { LogadoContext } from "../../context/LogadoContext.js";
import { Logo } from "./Logo.js";
import { useFocusEffect } from "@react-navigation/native";
 
// Página com os ativos disponíveis, buscados por API
export default AtivosView = () => {
    const { userId, token } = useContext(LogadoContext);

    const [acoes, setAcoes] = useState([]);
    const [fundos, setFundos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [ativoSelecionado, setAtivoSelecionado] = useState(null);
    const [modalError, setModalError] = useState(null);
    const [quantAtivo, setQuantAtivo] = useState("");

    const listaAtivos = async () => {
        setError("");
        setLoading(true);

        try {
            const dados_ativos = await buscaAtivos(token);

            setAcoes(dados_ativos.filter(a => a.tipo === "stock"));
            setFundos(dados_ativos.filter(a => a.tipo === "fund"));
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };

    const handleCompra = async () => {
        if (!quantAtivo || isNaN(quantAtivo)) {
            setModalError("Por favor, insira uma quantidade válida!");
            return;
        };

        try {
            await compraAtivos(ativoSelecionado, quantAtivo, userId, token);
            Alert.alert("Sucesso","Compra realizada com sucesso!");
        } catch (error) {
            setModalError(error.message);
        } finally {
            setIsVisible(false);
            listaAtivos();
        }
    };

    useFocusEffect(
        useCallback(() => {
            listaAtivos();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Ações disponíveis</Text>
        
            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <View style={styles.view_flatlist}>
                    <FlatList 
                        data={acoes}
                        numColumns={1}
                        keyExtractor={(item) => item.simbolo}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.ativo_container}
                                onPress={() => {
                                    setError("");
                                    setModalError("");
                                    setAtivoSelecionado(item);
                                    setIsVisible(true);
                                }}
                            >
                                <Logo
                                    uri={item.logo}
                                    width={55}
                                    height={55}
                                />
                                <Text style={styles.ativo_simbolo}>{item.simbolo}</Text>
                                <Text style={styles.ativo_nome}>{item.nome}</Text>
                                <Text style={styles.ativo_preco}>R$ {Number(item.valor).toFixed(2)}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.flatlist}
                    />
                </View>
                
            )}

            <Text style={styles.titulo}>Fundos disponíveis</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <View style={styles.view_flatlist}>
                    <FlatList 
                        data={fundos}
                        numColumns={1}
                        keyExtractor={(item) => item.simbolo}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.ativo_container}
                                onPress={() => {
                                    setError("");
                                    setModalError("");
                                    setAtivoSelecionado(item);
                                    setIsVisible(true);
                                }}
                            >
                                <Logo
                                    uri={item.logo}
                                    width={55}
                                    height={55}
                                />
                                <Text style={styles.ativo_simbolo}>{item.simbolo}</Text>
                                <Text style={styles.ativo_nome}>{item.nome}</Text>
                                <Text style={styles.ativo_preco}>R$ {Number(item.valor).toFixed(2)}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.flatlist}
                    />
                </View>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.modal_container}>
                    <View style={styles.modal_content}>
                        {ativoSelecionado && (
                            <>
                                <Text style={styles.modal_titulo}>Quantas unidades de {ativoSelecionado?.simbolo} deseja comprar?</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={quantAtivo}
                                    onChangeText={(text) =>{
                                        const valorPositivo = text.replace(/[^0-9.]/g, '');
                                        setQuantAtivo(valorPositivo);
                                    }}
                                />

                                {modalError ? <Text style={styles.error}> {modalError} </Text> : null}

                                <View style={styles.modal_buttons}>
                                    <TouchableOpacity
                                        style={styles.button_confirm}
                                        onPress={() => handleCompra()}
                                    >
                                        <Text style={styles.button_text}>Confirmar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button_cancel}
                                        onPress={() => setIsVisible(false)}
                                    >
                                        <Text style={styles.button_text}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        padding: 10
    },
    titulo: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        marginBottom: 10,
        color: "#fff",
        marginTop: 20,
    },
    view_flatlist: {
        backgroundColor: "#404040",
        borderRadius: 10,
        padding: 10,
        width: '100%',
        flex: 1
    },
    flatlist:{
        paddingBottom: 20,
    },
    ativo_container: {
        backgroundColor: '#1A1A1A',
        flexDirection: 'row',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    ativo_simbolo: {
        fontSize: 16,
        fontFamily: "Inter-Bold",
        color: "#fff",
        flex: 1,
        marginLeft: 15
    },
    ativo_nome: {
        fontSize: 14,
        fontFamily: "Inter",
        color: "#fff",
        flex: 1,
        marginRight: 10,
        textAlign: "left",
        justifyContent: "center"
    },
    ativo_preco: {
        fontSize: 16,
        fontFamily: "Inter-Bold",
        color: "#fff",
        textAlign: 'center'
    },
    error: {
        color: "red",
        fontFamily: "Inter",
        fontSize: 20,
        marginTop: 20
    },
    modal_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modal_content: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center',
        elevation: 10,
    },
    modal_titulo: {
        fontSize: 18,
        color: "black",
        fontFamily: "Inter",
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: "Inter",
    },
    modal_buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    button_confirm: {
        backgroundColor: '#24f07d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#000",
        alignItems: 'center',
        width: '48%',
    },
    button_cancel: {
        backgroundColor: '#f02424',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: "#000",
        alignItems: 'center',
        width: '48%',
    },
    button_text: {
        color: '#000',
        fontFamily: "Inter",
        fontSize: 16,
    },
});