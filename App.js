import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import LoginScreen from './src/api/screens/LoginScreen';
import DashboardScreen from './src/api/screens/DashboardScreen';
import { AuthProvider, AuthContext } from './context/authContext';

const NavigationWrapper = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#39A900" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  // ❌ No logueado
  if (!userToken) {
    return <LoginScreen />;
  }

  // ✅ Logueado → Dashboard
  return <DashboardScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});