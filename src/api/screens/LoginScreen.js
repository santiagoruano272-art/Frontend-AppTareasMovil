/* import React, {useState, useContext} from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../../context/authContext';
import { loginService } from '../../api/apiService';

const LoginScreen = async () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { Login } = useContext(AuthContext);

    const data = await loginService(email, password);
    console.log("RESPUESTA:", data);
    
    const handleLogin = async () => {
        if(!email || !password) return Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
        setLoading(true);
        try {
            const data = await loginService(email, password);
            Login(data.token); // Guardar el token en el contexto
        } catch (e) {
            Alert.alert('❌  Error de Login', e.message );
        } finally {
            setLoading(false);
        }

    };
    return(
        <View style={styles.container}>
            <Text style={styles.title}>ADSO gestor de tareas</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                KeyboardType="email-address" // Asegura que el teclado muestre el formato de correo
                autoCapitalize="none" // Evita que la primera letra se capitalice
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry // Oculta el texto ingresado
            />
            {loading ? (
                <ActivityIndicator size="large" color="#39A900" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} color="#39A900" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, 
    },
    title: {
        fontSize: 24, marginBottom: 20, fontWeight: 'bold', color: '#39A900', textAlign: 'center',
        },
    input: {
        borderBottomWidth:1, borderColor: "#ccc",marginBottom:20, padding: 10}
    },
);

export default LoginScreen;
*/
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../../context/authContext';
import { loginService } from '../../api/apiService';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { Login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
        }

        setLoading(true);

        try {
            const data = await loginService(email, password);
            console.log("RESPUESTA:", data);

            // ⚠️ Ajusta según tu backend
            Login(data.token || data.access);

        } catch (e) {
            Alert.alert('❌ Error de Login', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ADSO gestor de tareas</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" color="#39A900" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} color="#39A900" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#39A900',
        textAlign: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 20,
        padding: 10,
        width: '100%',
    },
});

export default LoginScreen;