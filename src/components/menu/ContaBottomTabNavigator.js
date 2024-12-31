import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import MinhaContaView from "../views/MinhaContaView";
import HistoricoView from "../views/HistoricoView";

const Tab = createBottomTabNavigator();
export default ContaBottomTabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Minha conta">
            {/* Dados pessoais + Saldo + Saque e Depósito */}
            <Tab.Screen 
                name="Minha conta" 
                component={MinhaContaView}
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

            {/* Histórico de transações, dividendos, saques e depósitos */}
            <Tab.Screen 
                name="Histórico" 
                component={HistoricoView}
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