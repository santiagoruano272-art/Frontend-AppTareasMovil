import React, { useContext, useEffect, useState } from 'react';
import { View,Text,TouchableOpacity,ActivityIndicator,Image,Alert,StyleSheet
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../../../context/authContext';
import { userService } from '../apiService';

const DashboardScreen = ({ goToTasks }) => {

    const { userToken, Logout } = useContext(AuthContext);

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // 🔹 Cargar perfil
    useEffect(() => {
        if (userToken) {
            fetchProfile();
        }
    }, [userToken]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile(userToken);
            setUserData(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Seleccionar imagen
    const pickImage = async () => {
        try {
            console.log("📸 Abriendo galería...");

            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert("Permiso requerido", "Debes aceptar permisos");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.7,
            });

            console.log("RESULTADO:", result);

            if (!result.canceled) {
                uploadImage(result.assets[0].uri);
            }

        } catch (error) {
            console.error("Error picker:", error);
            Alert.alert("Error", "No se pudo abrir la galería");
        }
    };

    // 🔹 Subir imagen
    const uploadImage = async (uri) => {
        try {
            setUploading(true);

            await userService.uploadProfileImage(userToken, uri);

            Alert.alert("Imagen actualizada");

            fetchProfile();

        } catch (error) {
            console.error(error);
            Alert.alert("Error al subir imagen");
        } finally {
            setUploading(false);
        }
    };

    // 🔹 Loading inicial
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

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>

                <TouchableOpacity onPress={Logout}>
                    <Text style={styles.logout}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            {/* PERFIL */}
            <View style={styles.profile}>

                <TouchableOpacity onPress={pickImage}>

                    {uploading ? (
                        <ActivityIndicator size="small" color="#39A900" />
                    ) : userData?.foto_url ? (
                        <Image
                            source={{ uri: userData.foto_url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text>Sin foto</Text>
                        </View>
                    )}

                </TouchableOpacity>

                <Text style={styles.email}>
                    {userData?.email || "Sin correo"}
                </Text>

                <Text style={styles.role}>
                    {userData?.rol || "Usuario"} 
                </Text>

            </View>

            {/* ACCIONES */}
            <View style={styles.actions}>

                <TouchableOpacity style={styles.button} onPress={goToTasks}>
                    <Text style={styles.buttonText}>Ver tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
                    <Text style={styles.buttonText}>Cambiar foto</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 20
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 20
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },

    logout: {
        color: 'red',
        fontWeight: 'bold'
    },

    profile: {
        alignItems: 'center',
        marginTop: 30
    },

    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60
    },

    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },

    email: {
        marginTop: 15,
        fontSize: 16
    },

    role: {
        color: '#777',
        marginTop: 5
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40
    },

    button: {
        backgroundColor: '#39A900',
        padding: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center'
    },

    buttonSecondary: {
        backgroundColor: '#555',
        padding: 15,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center'
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }

});

export default DashboardScreen;