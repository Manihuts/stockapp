import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Icon, Modal, Portal, Text, TextInput, Button, FAB } from "react-native-paper";
import { adicionaSaldo, fetchSaldo, fetchValorInvestido, removeSaldo } from "../../services/userService.js";
import { LogadoContext } from "../../context/LogadoContext.js";
import { useFocusEffect } from "@react-navigation/native";
 
// Página com saldo atual e valor investido do usuário + opções de saque e depósito
export default MinhaContaView = () => {
    const { userId, userName, token, logout } = useContext(LogadoContext);

    const [saldo, setSaldo] = useState(0);
    const [valorInvestido, setValorInvestido] = useState(0);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [tipoModal, setTipoModal] = useState("");
    const [modalError, setModalError] = useState(null);
    const [montante, setMontante] = useState("");

    const exibeInfo = async () => {
        setError("");
        setModalError("");

        try {
            const saldo_buscado = await fetchSaldo(userId, token);
            const valor_buscado = await fetchValorInvestido(userId, token);

            setSaldo(saldo_buscado);
            setValorInvestido(valor_buscado);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeslogar = async () => {
        try {
            const response = await logout();

            if (response.success) {
                Alert.alert("Logout bem sucedido", response.message);
            }
        } catch (error) {
            setError(response.error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            exibeInfo();
        },[])
    );

    const handleConfirm = async () => {
        if (!montante || isNaN(montante)) {
            setModalError("Por favor, insira um valor válido!");
            return;
        };

        if (tipoModal === "remove" && Number(montante) > saldo) {
            setModalError("Saldo insuficiente para realizar o saque!");
            return;
        }

        try {
            if (tipoModal === "add") {
                await adicionaSaldo(userId, montante, token);
            } else if (tipoModal === "remove") {
                await removeSaldo(userId, montante, token);
            }
    
            exibeInfo();
            setIsVisible(false);
            setMontante("");
        } catch (error) {
            setModalError(error.message);
        }
    };

    const openModal = (tipo) => {
        setTipoModal(tipo);
        setIsVisible(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.account_container}>
                <View style={styles.top_container}>
                    <Icon 
                        source="account-circle"
                        size={60}
                        color="#000"
                    />
                    <Text style={styles.titulo}> Olá {userName ? userName : "N/A"}! </Text>
                </View>
                <View style={styles.bottom_container}>
                    <Text style={styles.saldo_text}> Saldo disponível: </Text>
                    <Text style={styles.saldo_value}> R$ {Number(saldo).toFixed(2)}</Text>
                    <Text style={styles.saldo_text}> Dinheiro investido: </Text>
                    <Text style={styles.saldo_value}> R$ {Number(valorInvestido).toFixed(2)}</Text>
                </View>
            </View>

            {error ? <Text style={styles.error}> {error} </Text> : null}

            <View style={styles.button_container}>
                <Button 
                    mode="contained"
                    onPress={() => openModal("add")}
                    labelStyle={styles.button_label}
                    contentStyle={styles.button_content}
                    style={styles.button}
                >Depósito</Button>

                <Button 
                    mode="contained"
                    onPress={() => openModal("remove")}
                    labelStyle={styles.button_label}
                    contentStyle={styles.button_content}
                    style={styles.button}
                >Saque</Button>
            </View>

            <View style={styles.fab_container}>
                <FAB
                    size="large"
                    color="#fff"
                    icon="logout-variant"
                    style={styles.fab_button}
                    onPress={handleDeslogar}
                />
            </View>

            <Portal>
                <Modal visible={isVisible} onDismiss={() => setIsVisible(false)} contentContainerStyle={styles.modal}>
                    <Text style={styles.modal_text}>
                        {tipoModal === "add" ? "Quanto deseja depositar?" : "Quanto deseja sacar?"}
                    </Text>
                    <TextInput
                        label="Montante"
                        value={montante}
                        onChangeText={(text) => {
                            const valorPositivo = text.replace(/[^0-9.]/g, '');
                            setMontante(valorPositivo);
                        }}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {modalError ? <Text style={styles.error}> {modalError} </Text> : null}

                    <Button mode="contained" onPress={handleConfirm} style={styles.confirm_btn} labelStyle={{fontFamily: "Inter",}}>
                        Confirmar
                    </Button>
                </Modal>
            </Portal>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        marginTop: 0
    },
    account_container: {
        backgroundColor: '#24f07d',
        width: "100%",
        height: '45%',
        padding: 20,
        marginTop: 15,
        borderRadius: 30,
        alignItems: 'flex-start',
        marginBottom: 10
    },
    top_container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    saldo_text: {
        fontSize: 24,
        fontFamily: "Inter",
        color: "#000",
    },
    saldo_value: {
        fontSize: 38,
        fontFamily: "Inter-Bold",
        color: "#000",
    },
    titulo: {
        fontSize: 36,
        fontFamily: "Inter",
        color: "#000",
        marginLeft: 10
    },
    button_container: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between', 
        marginTop: 20,
        margin: 10
    },
    button_label: {
        fontSize: 20,
        fontFamily: "Inter",
        padding: 10,
        margin: 10
    },
    button_content: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
    },
    button: {
        flex: 1,
        backgroundColor: "#404040",
        minHeight: 60,
        borderRadius: 12,
        justifyContent: 'center',
        margin: 10
    },
    fab_container: {
        flex: 1,
        alignItems: "flex-end",
        width: "100%",
        marginTop: 100
    },
    fab_button: {
        flex: 1,
        margin: 10,
        backgroundColor: "#404040"
    },
    error: {
        color: "red",
        fontFamily: "Inter",
        fontSize: 20,
        marginBottom: 20
    },
    modal: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 20,
        borderRadius: 8
    },
    modal_text: {
        fontSize: 18,
        fontFamily: "Inter",
        color: "#000",
        marginBottom: 10,
        textAlign: 'center'
    },
    input: {
        marginBottom: 20,
        width: '100%',
        fontFamily: "Inter",
    },
    confirm_btn: {
        alignSelf: 'center',
        width: '100%'
    }
});