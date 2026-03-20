import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Text,View,Button,ActivityIndicator,FlatList
} from 'react-native';

import LoginScreen from './src/api/screens/LoginScreen';
import { AuthProvider, AuthContext } from './context/authContext';
import { taskApiService } from './src/api/apiService';

const NavigationWrapper = () => {
  const { userToken, isLoading, Logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [screen, setScreen] = useState("dashboard");

  useEffect(() => {
    if (userToken && screen === "tasks") {
      fetchUserTasks();
    }
  }, [userToken, screen]);

  const fetchUserTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await taskApiService.getAll(userToken);

      console.log("TAREAS:", response);

      if (response && response.datos) {
        setTasks(response.datos);
      } else {
        setTasks([]);
      }

    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  // 🔄 Cargando app
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#39A900" />
        <Text>Iniciando...</Text>
      </View>
    );
  }

  // 🔐 No logueado
  if (!userToken) {
    return (
      <View style={styles.container}>
        <LoginScreen />
      </View>
    );
  }

  // 🟢 DASHBOARD
  if (screen === "dashboard") {
    return (
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Dashboard</Text>
          <Button title="Salir" onPress={Logout} color="#ff4c4c" />
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>Bienvenido 👋</Text>
          <Text style={styles.subtitle}>Gestiona tus tareas fácilmente</Text>

          <View style={{ marginTop: 20 }}>
            <Button
              title="Ver Tareas"
              onPress={() => setScreen("tasks")}
              color="#39A900"
            />
          </View>
        </View>

      </View>
    );
  }

  // 📋 TAREAS
  if (screen === "tasks") {
    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.welcomeText}>Mis Tareas</Text>
          <Button title="Volver" onPress={() => setScreen("dashboard")} />
        </View>

        {loadingTasks ? (
          <ActivityIndicator size="small" color="#39A900" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>
                  {item.titulo || "Sin título"}
                </Text>

                <Text style={styles.taskDescription}>
                  {item.descripcion || "Sin descripción"}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>No hay tareas para mostrar.</Text>
                <Button title="Actualizar" onPress={fetchUserTasks} />
              </View>
            }
          />
        )}

      </View>
    );
  }
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
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 40   // 🔥 reemplaza SafeAreaView
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#39A900',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  listContent: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  emptyText: {
    color: '#999',
    marginBottom: 10,
    fontSize: 15
  }
});