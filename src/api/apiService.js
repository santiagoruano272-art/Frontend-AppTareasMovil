import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.8:8000/api";

// 🔐 LOGIN
export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al iniciar sesión");
        }

        return data;

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        throw error;
    }
};


// 📒 TASKS API
export const taskApiService = {

    // 📥 Obtener tareas
    getAll: async (token) => {
        try {
            const res = await fetch(`${BASE_URL}/tareas/`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al obtener tareas");
            }

            return data;

        } catch (error) {
            console.error("GET TASKS ERROR:", error);
            throw error;
        }
    },

    // ➕ Crear tarea
    create: async (token, data) => {
        try {
            const res = await fetch(`${BASE_URL}/tareas/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || "Error al crear tarea");
            }

            return responseData;

        } catch (error) {
            console.error("CREATE TASK ERROR:", error);
            throw error;
        }
    },

    // ✏️ Actualizar
    update: async (token, id, data) => {
        try {
            const res = await fetch(`${BASE_URL}/tareas/${id}/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.error || "Error al actualizar");
            }

            return responseData;

        } catch (error) {
            console.error("UPDATE TASK ERROR:", error);
            throw error;
        }
    },

    delete: async (token, id) => {
        try {
            const res = await fetch(`${BASE_URL}/tareas/${id}/`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Error al eliminar");
            }

            return true;

        } catch (error) {
            console.error("DELETE TASK ERROR:", error);
            throw error;
        }
    }
};


export const userService = {

    getProfile: async (token) => {
        try {
            const res = await fetch(`${BASE_URL}/perfil/`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const text = await res.text();

            console.log("TOKEN:", token);
            console.log("RAW PERFIL:", text);

            // 🔍 Validar JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error("La respuesta NO es JSON");
            }

            if (!res.ok) {
                throw new Error(data.error || "Error al obtener perfil");
            }

            return data;

        } catch (error) {
            console.error("PROFILE ERROR:", error);
            throw error;
        }
    }
};