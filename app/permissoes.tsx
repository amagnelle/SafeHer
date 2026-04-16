import {
    pedirPermissaoLocalizacao,
    pedirPermissaoNotificacao,
} from "@/services/permissoes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Permissoes() {
  const router = useRouter();

  const ativarLocalizacao = async () => {
    const ok = await pedirPermissaoLocalizacao();

    if (!ok) {
      alert("Permissão de localização negada.");
      return;
    }

    alert("Localização ativada com sucesso.");
  };

  const ativarNotificacoes = async () => {
    const ok = await pedirPermissaoNotificacao();

    if (!ok) {
      alert("Permissão de notificação negada.");
      return;
    }

    alert("Notificações ativadas com sucesso.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={42} color="#fff" />
        </View>

        <Text style={styles.title}>Sua segurança em primeiro lugar</Text>
        <Text style={styles.subtitle}>
          Para uma experiência mais segura e completa, ative alguns recursos
          importantes do SafeHer.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location" size={22} color="#C9A7FF" />
          <Text style={styles.cardTitle}>Localização</Text>
        </View>

        <Text style={styles.cardText}>
          Permita o acesso à sua localização para recursos de proteção e apoio
          em tempo real.
        </Text>

        <TouchableOpacity style={styles.cardButton} onPress={ativarLocalizacao}>
          <Text style={styles.cardButtonText}>Ativar localização</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications" size={22} color="#C9A7FF" />
          <Text style={styles.cardTitle}>Notificações</Text>
        </View>

        <Text style={styles.cardText}>
          Receba alertas, avisos importantes e atualizações essenciais do app.
        </Text>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={ativarNotificacoes}
        >
          <Text style={styles.cardButtonText}>Ativar notificações</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.skipText}>Agora não</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0A14",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  topArea: {
    alignItems: "center",
  },

  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#6C35B3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: "#CFC6DC",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20,
    marginTop: 18,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cardText: {
    fontSize: 14,
    color: "#CFC6DC",
    lineHeight: 20,
    marginBottom: 16,
  },

  cardButton: {
    backgroundColor: "#24182F",
    borderWidth: 1,
    borderColor: "#6C35B3",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },

  cardButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  bottomArea: {
    marginTop: 28,
  },

  primaryButton: {
    backgroundColor: "#6C35B3",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  skipText: {
    color: "#CFC6DC",
    textAlign: "center",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});