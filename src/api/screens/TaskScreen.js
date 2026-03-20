//Esta va a ser la pantalla de tareas, donde se van a mostrar las tareas del usuario, y se va a poder crear nuevas tareas, editar las tareas existentes y eliminar las tareas.
import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { AuthContext } from '../../context/authContext';
import { taskApiService } from '../apiService';

const TaskScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tasks, setTasks] = React.useState([]);
    
    useEffect(() => {
        if (userToken) {
            fetchTasks();
        }  
    }, [userToken]);

    const fetchTasks = async () => {
        try {
            const data = await taskApiService.getAll(userToken);
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tus Tareas</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text style={styles.taskDescription}>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
}