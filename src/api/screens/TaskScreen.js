import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { AuthContext } from '../../../context/authContext';
import { taskApiService } from '../apiService';

const TaskScreen = ({ goBack }) => {

    const { userToken } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userToken) {
            fetchTasks();
        }
    }, [userToken]);

    const fetchTasks = async () => {
        try {
            setLoading(true);

            const data = await taskApiService.getAll(userToken);

            console.log("TAREAS:", data);

            if (data && data.datos) {
                setTasks(data.datos);
            } else {
                setTasks([]);
            }

        } catch (error) {
            console.error("Error al obtener las tareas tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#39A900" />
                <Text>Cargando tareas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={goBack}>
                <Text style={styles.back}>← Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Tus Tareas</Text>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
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
                        <Text style={styles.empty}>No hay tareas aún</Text>

                        <TouchableOpacity style={styles.reloadBtn} onPress={fetchTasks}>
                            <Text style={styles.reloadText}>Actualizar</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 20
    },
    back: {
        color: '#39A900',
        marginTop: 40,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15
    },
    list: {
        paddingBottom: 20
    },
    taskItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    taskDescription: {
        color: '#555'
    },
    empty: {
        color: '#999',
        marginBottom: 10
    },
    reloadBtn: {
        backgroundColor: '#39A900',
        padding: 10,
        borderRadius: 8
    },
    reloadText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default TaskScreen;