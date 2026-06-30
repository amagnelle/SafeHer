import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SOSMapWeb() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa disponível no app mobile</Text>

      <Text style={styles.text}>
        O rastreamento em tempo real usa recursos nativos do celular, como GPS e mapa.
        Para testar corretamente, abra o SafeHer pelo Expo Go.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/botao")}>
        <Text style={styles.buttonText}>Voltar para o início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0030",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
  },

  text: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },

  button: {
    backgroundColor: "#A855F7",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});