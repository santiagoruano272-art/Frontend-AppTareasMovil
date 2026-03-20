const DashboardScreen = ({ goToTasks }) => {

    const { userToken, Logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userToken) {
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

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permiso requerido", "Debes permitir acceso a la galería");
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

            const res = await userService.uploadProfileImage(userToken, uri);

            console.log("✅  IMAGEN SUBIDA:", res);

            fetchProfile();

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "❌  No se pudo subir la imagen");
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

                <TouchableOpacity onPress={pickImage}>
                    {userData?.foto_url ? (
                        <Image
                            source={{ uri: userData.foto_url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text>Subir Foto</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={styles.email}>
                    {userData?.email || "Sin correo"}
                </Text>

                <Text style={styles.welcome}>
                    Bienvenido 👋
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={goToTasks}
                >
                    <Text style={styles.buttonText}>Ir a tareas</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};