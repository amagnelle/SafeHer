import { loginUsuario } from "@/src/models/firebase";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
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
  //
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  const handleLogin = async () => {
    try {
      if (!email || !senha) {
        alert("Preencha todos os campos");
        return;
      }

      setLoading(true);

      const user = await loginUsuario(email, senha);

      console.log("Logado:", user.email);

      router.push("/cadastro");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

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
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loginBox,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.brand}>SafeHer</Text>
        </View>

        <Text style={styles.subtitle}>Bem-vinda de volta!</Text>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.divider} />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push("/cadastro")}>
            <Text style={styles.linkStrong}>Cadastre-se</Text>
          </TouchableOpacity>

          <Text style={styles.link}>Esqueceu a senha?</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
  },

  loginBox: {
    width: Platform.OS === "web" ? "90%" : "100%",
    maxWidth: Platform.OS === "web" ? 400 : "100%",
    height: Platform.OS === "web" ? "auto" : "100%",
    backgroundColor: "#9D4EDD",
    padding: 30,
    borderRadius: Platform.OS === "web" ? 20 : 0,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },

  logo: {
    padding: "40%",
    width: 140,
    height: 140,
    resizeMode: "cover",
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#EDE9FE",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },

  inputGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },

  input: {
    padding: 21,
    fontSize: 18,
    color: "#1F2937",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  button: {
    backgroundColor: "#5B21B6",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  footer: {
    alignItems: "center",
    gap: 8,
  },

  link: {
    color: "#C4B5FD",
    fontSize: 16,
    fontWeight: "bold",
  },

  linkStrong: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
