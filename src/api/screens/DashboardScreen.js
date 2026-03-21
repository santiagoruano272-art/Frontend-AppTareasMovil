import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../../../context/authContext';
import { userService } from '../apiService';

const DashboardScreen = ({ goToTasks }) => {

    const { userToken, Logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userToken) fetchProfile();
    }, [userToken]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile(userToken);
            setUserData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permiso requerido");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri) => {
        try {
            setLoading(true);
            await userService.uploadProfileImage(userToken, uri);
            fetchProfile();
        } catch (error) {
            Alert.alert("Error al subir imagen");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#39A900" />
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <TouchableOpacity onPress={Logout}>
                    <Text style={styles.logout}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>

                {userData?.foto_url ? (
                    <Image source={{ uri: userData.foto_url }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text>Sin Foto</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
                    <Text style={styles.changePhotoText}>Cambiar foto</Text>
                </TouchableOpacity>

                <Text style={styles.email}>
                    {userData?.email || "Sin correo"}
                </Text>

                <Text style={styles.role}>
                    Rol: {userData?.rol || "No definido"}
                </Text>

                <Text style={styles.welcome}>
                    Bienvenido a tu block de tareas 📒
                </Text>

                <TouchableOpacity style={styles.button} onPress={goToTasks}>
                    <Text style={styles.buttonText}>Ir a tareas</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40
    },

    title: { fontSize: 22, fontWeight: 'bold' },

    logout: { color: 'red' },

    content: {
        marginTop: 40,
        alignItems: 'center'
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50
    },

    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },

    changePhotoBtn: {
        marginTop: 10,
        backgroundColor: '#ccc',
        padding: 8,
        borderRadius: 6
    },

    changePhotoText: {
        fontSize: 12
    },

    email: {
        marginTop: 10
    },

    role: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        marginBottom: 10
    },

    welcome: {
        fontSize: 18,
        marginVertical: 10
    },

    button: {
        backgroundColor: '#39A900',
        padding: 12,
        borderRadius: 8,
        marginTop: 10
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DashboardScreen;