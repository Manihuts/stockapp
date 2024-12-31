import React from 'react';
import { LogBox, StyleSheet, View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import MenuDrawerNavigator from './src/components/menu/MenuDrawerNavigator';
import { LogadoContextProvider } from './src/context/LogadoContext';
import { useFonts } from 'expo-font';
import { createNavigationContainerRef } from '@react-navigation/native';

LogBox.ignoreLogs(['Support for defaultProps will be removed from function components']);

export const navigationRef = createNavigationContainerRef();
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
}
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter': require("./assets/fonts/Inter.ttf"),
    'Inter-Bold': require("./assets/fonts/Inter-Bold.ttf")
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading_container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <LogadoContextProvider>
        <MenuDrawerNavigator />
      </LogadoContextProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loading_container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: 'center',
    alignItems: 'center',
  }
});
