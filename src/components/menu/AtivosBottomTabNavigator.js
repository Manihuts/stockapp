import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AtivosView from "../views/AtivosView";
import MeusAtivosView from "../views/MeusAtivosView";

const Tab = createBottomTabNavigator();
export default AtivosBottomTabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Ativos Disponíveis">
            {/* Ativos disponíveis (API externa) */}
            <Tab.Screen 
                name="Ativos Disponíveis" 
                component={AtivosView}
                options={{ 
                    headerShown: false,
                    tabBarIconStyle: {
                        display: "none"
                    },
                    tabBarLabelStyle: {
                        fontSize: 15,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        textAlignVertical: 'center',
                    }
                }}
            />

            {/* Ativos do usuário */}
            <Tab.Screen 
                name="Meus ativos" 
                component={MeusAtivosView}
                options={{ 
                    headerShown: false,
                    tabBarIconStyle: {
                        display: "none"
                    },
                    tabBarLabelStyle: {
                        fontSize: 15,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        textAlignVertical: 'center',
                    }
                }}
            />
        </Tab.Navigator>
    )
};