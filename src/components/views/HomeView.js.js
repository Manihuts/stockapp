import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming, withRepeat, Easing } from "react-native-reanimated";

export default HomeView = ({ navigation }) => {
    const opacityValue = useSharedValue(0); 
    const rotation = useSharedValue(0);

    const fadeInStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacityValue.value, { duration: 1500 }),
        };
    });

    const rotationStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateY: `${rotation.value}deg`,
                },
            ],
        };
    });

    useEffect(() => {
        opacityValue.value = 1;
    }, []);

    const handlePress = () => {
        rotation.value = 0;
        rotation.value = withDelay(75, withTiming(1080, { duration: 420, easing: Easing.linear }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.logo_container}>
            <TouchableWithoutFeedback
                    onPress={handlePress}
                >
                    <Animated.Image
                        source={require("../../../assets/images/logo.png")}
                        style={[
                            styles.logo,
                            fadeInStyle,
                            rotationStyle,
                        ]}
                    />
                </TouchableWithoutFeedback>
            </View>
            <Text style={styles.titulo}>Bem-vindo/a ao StockApp!</Text>
            <Text style={styles.subtitulo}>Sua jornada financeira começa aqui.</Text>
            <Button 
                mode="contained" 
                icon={() => <Icon source="account-multiple-plus" size={34} color="#000" />}
                onPress={() => navigation.navigate("Cadastro")}
                style={styles.botao}
                labelStyle={{ fontSize: 18, color: "#000", fontFamily: "Inter" }}
                buttonColor="#24f07d"
            >
                Crie sua conta agora!
            </Button>

            <View style={styles.footer}>
                <Text style={styles.footer_texto}>Logo desenhada por: @dahandandan</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo_container: {
        marginBottom: 20
    },
    logo: {
        width: 250,
        height: 200,
        resizeMode: 'contain'
    },
    titulo: {
        fontSize: 26,
        fontFamily: "Inter-Bold",
        color: "#fff"
    },
    subtitulo: {
        fontSize: 20,
        fontFamily: "Inter",
        color: "#fff"
    },
    botao: {
        borderRadius: 50,
        margin: 30,
        padding: 5
    },
    footer: {
        position: "absolute",
        bottom: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    footer_texto: {
        fontSize: 14,
        fontFamily: "Inter",
        color: "#fff",
        textAlign: 'center',
    }
});