import React, { useEffect, useState, useContext } from 'react';
import { View,Text,StyleSheet,Image,ActivityIndicator,TouchableOpacity
} from 'react-native';
import { AuthContext } from '../../context/authContext';
import { profileService } from '../apiService';

const DashboardScreen = () => {
  const { userToken, Logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile(userToken);
      console.log("PERFIL:", data);

      setUser(data);
    } catch (error) {
      console.error("Error al obtener perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#39A900" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* FOTO DE PERFIL */}
      <Image
        source={{
          uri: user?.foto_url || "https://via.placeholder.com/150"
        }}
        style={styles.avatar}
      />

      {/* DATOS DEL USUARIO */}
      <Text style={styles.name}>
        {user?.nombre || "Usuario"}
      </Text>

      <Text style={styles.email}>
        {user?.email || "Sin email"}
      </Text>

      {/* BOTÓN LOGOUT */}
      <TouchableOpacity style={styles.button} onPress={Logout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#39A900'
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30
  },
  button: {
    backgroundColor: '#ff4c4c',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});