import { useRouter } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function Welcome() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/fundo.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>SafeHer</Text>
        <Text style={styles.subtitle}>Sua segurança começa aqui.</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.primaryText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/cadastro")}>
          <Text style={styles.secondaryText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", //
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },

  subtitle: {
    fontSize: 16,
    color: "#E0D4F7",
    marginBottom: 40,
  },

  primaryButton: {
    backgroundColor: "#5E2CA5",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginBottom: 15,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  secondaryText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});
