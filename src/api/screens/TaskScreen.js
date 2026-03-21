import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';

import { AuthContext } from '../../../context/authContext';
import { taskApiService } from '../apiService';

const TaskScreen = ({ goBack }) => {

    const { userToken } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskApiService.getAll(userToken);

            setTasks(data?.datos || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const saveTask = async () => {
        try {
            if (!titulo) {
                Alert.alert("El título es obligatorio");
                return;
            }

            if (editingId) {
                await taskApiService.update(userToken, editingId, { titulo, descripcion });
            } else {
                await taskApiService.create(userToken, { titulo, descripcion });
            }

            setTitulo("");
            setDescripcion("");
            setEditingId(null);
            fetchTasks();

        } catch (error) {
            console.error(error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await taskApiService.delete(userToken, id);
            fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const editTask = (task) => {
        setTitulo(task.titulo);
        setDescripcion(task.descripcion);
        setEditingId(task.id);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#39A900" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={goBack}>
                <Text style={styles.back}>← Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Mis Tareas</Text>

            <TextInput
                placeholder="Título"
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
            />

            <TextInput
                placeholder="Descripción"
                style={styles.input}
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <TouchableOpacity style={styles.addBtn} onPress={saveTask}>
                <Text style={styles.addText}>
                    {editingId ? "Actualizar" : "Agregar"}
                </Text>
            </TouchableOpacity>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{item.titulo}</Text>
                            <Text style={styles.cardDesc}>{item.descripcion}</Text>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => editTask(item)}>
                                <Text>✏️</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deleteTask(item.id)}>
                                <Text>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },

    back: { marginTop: 40, color: '#39A900', fontWeight: 'bold' },

    title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },

    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10
    },

    addBtn: {
        backgroundColor: '#39A900',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center'
    },

    addText: { color: '#fff', fontWeight: 'bold' },

    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center'
    },

    cardTitle: { fontWeight: 'bold' },
    cardDesc: { color: '#555' },

    actions: {
        flexDirection: 'row',
        gap: 10
    },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default TaskScreen;