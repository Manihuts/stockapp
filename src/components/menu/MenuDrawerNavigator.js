import { createDrawerNavigator } from "@react-navigation/drawer";
import { CommonActions, getFocusedRouteNameFromRoute, NavigationContainer } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import LoginView from "../views/LoginView.js";
import HomeStackNavigator from "./HomeStackNavigator.js";
import LogadoBottomTabNavigator from "./LogadoBottomTabNavigator.js";
import { Button, Text } from "react-native-paper";
import { LogadoContext } from "../../context/LogadoContext.js";
import { StyleSheet, View } from "react-native";
import GithubAuthScreen from "../views/GithubAuthScreen.js";

const Drawer = createDrawerNavigator();
export default MenuDrawerNavigator = () => {
    const { userId, navigationRef } = useContext(LogadoContext);

    useEffect(() => {
        if (userId && navigationRef.current) {
            navigationRef.current.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Logado' }],
                })
            );
        }
    }, [userId]);

    return (
        <NavigationContainer ref={navigationRef}>
            <Drawer.Navigator initialRouteName={userId ? "Logado" : "Home"}>
                {/* Landing page + Cadastro */}
                <Drawer.Screen 
                    name="Home"   
                    component={HomeStackNavigator}
                    options={({ route }) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? "Home"
                        if (routeName == "Cadastro") { return ({ headerShown: false }) }
                    }}
                />

                {/* Página de login */}
                <Drawer.Screen 
                    name="Login" 
                    component={LoginView}
                />

                {/* Páginas do usuário logado */}
                {userId &&               
                    <Drawer.Screen
                        name="Logado"
                        component={LogadoBottomTabNavigator}
                        options={{ headerShown: false }}
                    />
                }

                <Drawer.Screen
                    name="GithubAuth"
                    component={GithubAuthScreen}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        color: "#fff"
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        marginBottom: 20
    },
});