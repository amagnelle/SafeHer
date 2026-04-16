import { loginUsuario } from "@/src/models/firebase";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    try {
      if (!email || !senha) {
        showModal("Preencha todos os campos");
        return;
      }

      setLoading(true);

      const user = await loginUsuario(email, senha);

      console.log("Logado:", user.email);

      router.replace("/");
    } catch (error: any) {
      showModal(error.message);
    } finally {
      setLoading(false);
    }
  };
  //efeitos da animação
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Atenção</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ImageBackground
        source={require("@/assets/images/fundo.png")}
        style={styles.container}
        resizeMode="cover"
      >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.loginBox,
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Bem-vinda de volta!</Text>

          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#ccc"
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/cadastro")}>
            <Text style={styles.link}>Não tem conta? Criar agora</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loginBox: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  subtitle: {
    color: "#E0D4F7",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    height: 55,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  button: {
    backgroundColor: "#5E2CA5",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  link: {
    color: "#fff",
    marginTop: 15,
    textDecorationLine: "underline",
  },

 modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },

  modalMessage: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 12,
    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "#5E2CA5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
