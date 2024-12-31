import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardView from "../views/DashboardView";
import ContaBottomTabNavigator from "./ContaBottomTabNavigator";
import AtivosBottomTabNavigator from "./AtivosBottomTabNavigator";
import { Icon } from "react-native-paper";

const Tab = createBottomTabNavigator();
export default LogadoBottomTabNavigator = () => {
    return ( 
        <Tab.Navigator initialRouteName="Conta">
            {/* Minha conta + Histórico */}
            <Tab.Screen 
                name="Conta" 
                component={ContaBottomTabNavigator}
                options={{ 
                    headerShown: false, 
                    tabBarIcon: () => (
                        <Icon source="account" size={30} />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 12
                    }
                }}
            />

            {/* Ativos + Meus ativos */}
            <Tab.Screen
                name="Ativos"
                component={AtivosBottomTabNavigator}
                options={{ 
                    headerShown: false,
                    tabBarIcon: () => (
                        <Icon source="finance" size={30} />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 12
                    }
                }}
            />

            {/* Dashboards informativas */}
            <Tab.Screen 
                name="Dashboards" 
                component={DashboardView}
                options={{ 
                    headerShown: false, 
                    tabBarIcon: () => (
                        <Icon source="tablet-dashboard" size={30} />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 12
                    }
                }}
            /> 
        </Tab.Navigator>
    )
};