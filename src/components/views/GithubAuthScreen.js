import React, { useContext } from "react";
import WebView from "react-native-webview";
import { LogadoContext } from "../../context/LogadoContext.js";
import { useNavigation } from "@react-navigation/native";

const GithubAuthScreen = () => {
    const navigation = useNavigation();
    const authUrl = `http://3.227.45.73:3000/auth/github/login`;
    const { loginGithub } = useContext(LogadoContext);

    return (
        <WebView
            source={{ uri: authUrl }}
            style={{ flex: 1 }}
            onMessage={async (event) => {
                console.log("Mensagem recebida do WebView:", event.nativeEvent.data);
                try {
                    const data = JSON.parse(event.nativeEvent.data);
                    console.log("Dados recebidos:", data);
                    await loginGithub(data);
                    navigation.goBack();
                } catch (error) {
                    console.error("Erro ao parsear dados do WebView:", error);
                }
            }}
        />
    );
};

export default GithubAuthScreen;