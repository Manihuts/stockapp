import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeView from "../views/HomeView.js.js";
import CadastroView from "../views/CadastroView.js";
import { Icon } from "react-native-paper";

const Stack = createStackNavigator();
export default HomeStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Homepage">
            {/* Landing page do app */}
            <Stack.Screen 
                name="Homepage" 
                component={HomeView} 
                options={{ headerShown: false }}
            />

            {/* Página de cadastro */}
            <Stack.Screen 
                name="Cadastro" 
                component={CadastroView} 
                options={{
                    headerBackTitleVisible: false,
                    headerTitle: "",
                    headerStyle: { backgroundColor: '#000' },
                    headerBackImage: () => (
                        <Icon source="keyboard-backspace" size={50} color="#fff"></Icon>
                    )                  
                    }}
            />
        </Stack.Navigator>
    );
};