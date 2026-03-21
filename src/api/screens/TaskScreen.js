import React, { useContext, useEffect, useState } from 'react';
import { View,Text,FlatList,TouchableOpacity,ActivityIndicator,StyleSheet,TextInput,Modal,Alert,RefreshControl
} from 'react-native';

import { AuthContext } from '../../../context/authContext';
import { taskApiService } from '../apiService';

const TaskScreen = ({ goBack }) => {

    const { userToken } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [editId, setEditId] = useState(null);

    // ✅ Cargar tareas
    useEffect(() => {
        if (userToken) {
            fetchTasks();
        }
    }, [userToken]);

    // 🔹 OBTENER TAREAS
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const data = await taskApiService.getAll(userToken);
            setTasks(data?.datos || []);

        } catch (error) {
            console.error("Error al obtener tareas:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 REFRESH
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTasks();
        setRefreshing(false);
    };

    // 🔹 CREAR / EDITAR
    const handleSave = async () => {

        // ✅ VALIDACIONES FRONTEND
        if (titulo.trim().length < 5) {
            Alert.alert("Error", "El título debe tener mínimo 5 caracteres");
            return;
        }

        if (descripcion.trim().length < 10) {
            Alert.alert("Error", "La descripción debe tener mínimo 10 caracteres");
            return;
        }

        try {
            if (editId) {
                await taskApiService.update(userToken, editId, {
                    titulo,
                    descripcion
                });
            } else {
                await taskApiService.create(userToken, {
                    titulo,
                    descripcion
                });
            }

            resetForm();
            fetchTasks();

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo guardar la tarea");
        }
    };

    // 🔹 ELIMINAR
    const handleDelete = (id) => {
        Alert.alert("Eliminar", "¿Seguro que quieres eliminar?", [
            { text: "Cancelar" },
            {
                text: "Eliminar",
                onPress: async () => {
                    try {
                        await taskApiService.delete(userToken, id);
                        fetchTasks();
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        ]);
    };

    // 🔹 EDITAR
    const handleEdit = (task) => {
        setTitulo(task.titulo);
        setDescripcion(task.descripcion);
        setEditId(task.id);
        setModalVisible(true);
    };

    const resetForm = () => {
        setTitulo("");
        setDescripcion("");
        setEditId(null);
        setModalVisible(false);
    };

    // 🔄 LOADING
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#39A900" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Text style={styles.back}>← Volver</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Mis tareas</Text>
            </View>

            {/* LISTA */}
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>

                        <Text style={styles.taskTitle}>
                            {item.titulo}
                        </Text>

                        <Text style={styles.taskDesc}>
                            {item.descripcion}
                        </Text>

                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleEdit(item)}>
                                <Text>✏️</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Text>🗑️</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No hay tareas aún</Text>
                    </View>
                }
            />

            {/* BOTÓN FLOTANTE */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>

            {/* MODAL */}
            <Modal visible={modalVisible} animationType="slide">

                <View style={styles.modalContainer}>

                    <Text style={styles.modalTitle}>
                        {editId ? "Editar tarea" : "Nueva tarea"}
                    </Text>

                    <TextInput
                        placeholder="Título (mínimo 5 caracteres)"
                        style={styles.input}
                        value={titulo}
                        onChangeText={setTitulo}
                    />

                    <TextInput
                        placeholder="Descripción (mínimo 10 caracteres)"
                        style={styles.input}
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveText}>Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={resetForm}>
                        <Text style={styles.cancel}>Cancelar</Text>
                    </TouchableOpacity>

                </View>

            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f2f5'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 20,
        marginBottom: 10
    },

    back: {
        color: '#39A900',
        fontWeight: 'bold'
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 6,
        padding: 15,
        borderRadius: 10,
        elevation: 2
    },

    taskTitle: {
        fontWeight: 'bold'
    },

    taskDesc: {
        color: '#666',
        marginTop: 5
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 15
    },

    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#39A900',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },

    fabText: {
        color: '#fff',
        fontSize: 28
    },

    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },

    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center'
    },

    input: {
        backgroundColor: '#eee',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8
    },

    saveBtn: {
        backgroundColor: '#39A900',
        padding: 12,
        borderRadius: 8
    },

    saveText: {
        color: '#fff',
        textAlign: 'center'
    },

    cancel: {
        marginTop: 10,
        textAlign: 'center',
        color: 'red'
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default TaskScreen;