import React, { useContext, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { LogadoContext, navigationRef } from "../../context/LogadoContext.js";
import { useNavigation } from "@react-navigation/native";

export default LoginView = () => {
    const navigation = useNavigation();
    const { loginNormal } = useContext(LogadoContext);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const handleNormalLogin = async () => {
        setError("");
        const result = await loginNormal(email, senha);

        if (result.success) {
            Alert.alert("Sucesso", "Login realizado com sucesso!");
            navigation.goBack();
        } else {
            setError(result.message);
        }
    };

    const handleGithubLogin = async () => {
        setError("");
        navigation.navigate("GithubAuth");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Faça seu login abaixo:</Text>

            <TextInput
                label="E-mail"
                value={email}
                onChangeText={(value) => setEmail(value)}
                style={styles.input}
                labelStyle={{ color: "#fff" }}
                textColor="#fff"
                underlineColor="#0a4f28"
                activeUnderlineColor="#24f07d"
                mode="flat"
            />

            <TextInput
                label="Senha"
                value={senha}
                onChangeText={(value) => setSenha(value)}
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
                onPress={handleNormalLogin}
                style={styles.button}
                labelStyle={{ fontSize: 19, color: "#000", fontFamily: "Inter" }}
                buttonColor="#24f07d"
            >
                Login convencional
            </Button>

            <Button
                mode="contained"
                onPress={handleGithubLogin}
                style={styles.button}
                labelStyle={{ fontSize: 19, color: "#000", fontFamily: "Inter" }}
                buttonColor="#24f07d"
            >
                Login com GitHub
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
        margin: 10
    },
    error: {
        fontFamily: "Inter",
        color: "red",
        fontSize: 20
    }
});