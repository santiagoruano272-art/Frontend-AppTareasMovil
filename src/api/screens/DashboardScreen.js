import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../../context/authContext';
import { userService } from '../apiService';
import * as ImagePicker from 'expo-image-picker';

const DashboardScreen = ({ navigation }) => {
    console.log("DASHBOARD RENDER");
    const { userToken, Logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

useEffect(() => {
    if (userToken) {
        setLoading(true);
        fetchProfile();
    }
}, [userToken]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile(userToken);
            console.log("PERFIL:", data);
            setUserData(data);
        } catch (error) {
            console.error("Error perfil:", error);
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

            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <TouchableOpacity onPress={Logout}>
                    <Text style={styles.logout}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>

                {/* FOTO */}
                {userData?.foto_url ? (
                    <Image 
                        source={{ uri: userData.foto_url }} 
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text>Sin Foto</Text>
                    </View>
                )}

                {/* EMAIL */}
                <Text style={styles.email}>
                    {userData?.email || "Sin correo"}
                </Text>

                <Text style={styles.welcome}>
                    Bienvenido a tu block de tareas 📒
                </Text>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('Tasks')}
                >
                    <Text style={styles.buttonText}>Ir a tareas</Text>
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
    header: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    logout: {
        color: 'red'
    },
    content: {
        marginTop: 50,
        alignItems: 'center'
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    email: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10
    },
    welcome: {
        fontSize: 20,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#39A900',
        padding: 12,
        borderRadius: 10
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



const pickImage = async () => {
    try {
        // Permisos
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            alert("Permiso requerido");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;

            console.log("IMAGEN:", imageUri);

            uploadImage(imageUri);
        }

    } catch (error) {
        console.error("Error picker:", error);
    }
};