import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { registerUser } from "../../services/userService";

export default CadastroView = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            drawerLockMode: "locked-closed"
        });
    }, [navigation]);

    const [usuario, setUsuario] = useState({
        nome: "",
        email: "",
        senha: ""
    });
    const [error, setError] = useState("");

    const handleInput = (campo, valor) => {
        setUsuario({ ...usuario, [campo]: valor });
    };

    const handleCadastro = async () => {
        setError("");
        try {
            await registerUser(usuario);
            Alert.alert("Sucesso", "Usuário registrado com sucesso!");
            navigation.navigate("Homepage");
        } catch (error) {
            setError(error.message)
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Cadastre-se aqui!</Text>

            <TextInput
                label="Nome completo"
                value={usuario.nome}
                onChangeText={(value) => handleInput("nome", value)}
                style={styles.input}
                textColor="#fff"
                underlineColor="#0a4f28"
                activeUnderlineColor="#24f07d"
                mode="flat"
            />
            
            <TextInput
                label="E-mail"
                value={usuario.email}
                onChangeText={(value) => handleInput("email", value)}
                style={styles.input}
                textColor="#fff"
                underlineColor="#0a4f28"
                activeUnderlineColor="#24f07d"
                mode="flat"
                keyboardType="email-address"
            />

            <TextInput
                label="Senha"
                value={usuario.senha}
                onChangeText={(value) => handleInput("senha", value)}
                style={styles.input}
                labelStyle={{ color: "#fff" }}
                textColor="#fff"
                underlineColor="#0a4f28"
                activeUnderlineColor="#24f07d"
                mode="flat"
                secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                mode="contained"
                onPress={handleCadastro}
                style={styles.button}
                labelStyle={{ fontSize: 20, color: "#000", fontFamily: "Inter" }}
                buttonColor="#24f07d"
            >
                Registrar
            </Button>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    },
    titulo: {
        fontSize: 24,
        fontFamily: "Inter",
        marginBottom: 24,
        color: "#fff"
    },
    input: {
        width: '100%',
        marginBottom: 16,
        backgroundColor: "#2A2A2A"
    },
    button: {
        width: '100%',
        padding: 8,
        borderRadius: 50,
    },
    error: {
        fontFamily: "Inter",
        color: "red",
        fontSize: 20
    }
});