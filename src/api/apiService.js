const BASE_URL = "http://192.168.1.8:8000/api";

export const loginService = async (email, password) => {
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
};

export const taskApiService = {
    getAll: (token) =>
        fetch(`${BASE_URL}/tareas/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json()),
};

export const userService = {

    getProfile: async (token) => {
        const res = await fetch(`${BASE_URL}/perfil/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al obtener perfil");
        }

        return data;
    },

    uploadProfileImage: async (token, imageUri) => {
        const formData = new FormData();

        formData.append("imagen", {
            uri: imageUri,
            name: "profile.jpg",
            type: "image/jpeg",
        });

        const res = await fetch(`${BASE_URL}/perfil/foto/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al subir imagen");
        }

        return data;
    },
};