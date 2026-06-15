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

        <Text style={styles.subtitle}>
          Sua segurança começa aqui.
        </Text>

        {/* BOTÃO ENTRAR */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.primaryText}>Entrar</Text>
        </TouchableOpacity>

        {/* BOTÃO CRIAR CONTA */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/perfil")}
        >
          <Text style={styles.secondaryText}>
            Criar conta
          </Text>
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
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#E0D4F7",
    marginBottom: 50,
  },

  primaryButton: {
    backgroundColor: "#6C2BD9",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  primaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    width: "80%",
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },

  secondaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});