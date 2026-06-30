import { loginUsuario } from "@/src/models/firebase";
import { auth } from "../src/models/firebaseConfig";

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const router = useRouter();

  // Estados dos campos e controle da tela
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados do modal de aviso
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Animação de entrada da tela
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Se já estiver logada, envia direto para a tela principal
    if (auth.currentUser) {
      router.replace("/botao");
    }
  }, []);

  useEffect(() => {
    // Animação suave ao abrir a tela
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

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    // Validações simples antes de tentar logar
    if (!email || !senha) {
      showModal("Preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      showModal("Digite um e-mail válido");
      return;
    }

    if (senha.length < 6) {
      showModal("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const user = await loginUsuario(email, senha);

      console.log("Logado:", user.email);

      router.replace("/botao");
    } catch (error: any) {
      showModal(error?.message ?? "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal usado para mensagens de validação e erro */}
      <Modal
        animationType="fade"
        transparent
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
        source={require("@/assets/images/corSolida.png")}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Faz a tela se ajustar quando o teclado aparece */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Permite rolar a tela caso o teclado cubra parte do formulário */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.overlay}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backText}>‹</Text>
              </TouchableOpacity>

              <Animated.View
                style={[
                  styles.loginBox,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                  },
                ]}
              >
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />

                <Text style={styles.title}>Bem-vinda de volta!</Text>

                <Text style={styles.subtitle}>
                  Entre para acessar sua rede de proteção.
                </Text>

                <View style={styles.formCard}>
                  <TextInput
                    placeholder="E-mail"
                    placeholderTextColor="rgba(255,255,255,0.55)"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />

                  <View style={styles.inputDivider} />

                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor="rgba(255,255,255,0.55)"
                    style={styles.input}
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                  />
                </View>

                <TouchableOpacity>
                  <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/cadastro")}>
                  <Text style={styles.link}>
                    Ainda não possui conta?{" "}
                    <Text style={styles.linkHighlight}>Criar conta</Text>
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  overlay: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "rgba(8, 0, 24, 0.54)",
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  loginBox: {
    width: "100%",
    maxWidth: 370,
    alignItems: "center",
    marginTop: 20,
  },

  backButton: {
    position: "absolute",
    top: 70,
    left: 28,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "300",
  },

  logoImage: {
    width: 300,
    height: 300,
    marginBottom: 26,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "rgba(255,255,255,0.74)",
    marginBottom: 34,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
  },

  formCard: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginBottom: 18,
  },

  input: {
    width: "100%",
    height: 62,
    paddingHorizontal: 22,
    color: "#FFFFFF",
    fontSize: 16,
  },

  inputDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginHorizontal: 18,
  },

  forgotText: {
    color: "#C084FC",
    fontSize: 14,
    marginBottom: 26,
  },

  button: {
    backgroundColor: "#A855F7",
    height: 62,
    width: "100%",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 18,
  },

  link: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
  },

  linkHighlight: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  modalContainer: {
    width: "82%",
    maxWidth: 330,
    padding: 24,
    backgroundColor: "#1E1233",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 15,
    color: "rgba(255,255,255,0.72)",
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 21,
  },

  modalButton: {
    backgroundColor: "#A855F7",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 14,
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});