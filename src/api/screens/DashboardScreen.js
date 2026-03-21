import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Alert,
    StyleSheet
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
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert("Permiso requerido", "Debes aceptar permisos");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.7,
            });

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

    // 🔹 Loading
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

                {/* INFO IZQUIERDA */}
                <View style={styles.info}>
                    <Text style={styles.email}>
                        {userData?.email || "Sin correo"}
                    </Text>

                    <Text style={styles.role}>
                        {userData?.rol || "Usuario"}
                    </Text>
                </View>

                {/* FOTO DERECHA */}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        elevation: 2
    },

    info: {
        flex: 1
    },

    avatar: {
        width: 110,
        height: 80,
        borderRadius: 10
    },

    avatarPlaceholder: {
        width: 110,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },

    email: {
        fontSize: 16,
        fontWeight: 'bold'
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