import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const alertas = [
  {
    id: "1",
    data: "22 de junho de 2026",
    hora: "14:35",
    status: "Encerrado",
    pontos: 14,
    duracao: "18 minutos",
  },
  {
    id: "2",
    data: "20 de junho de 2026",
    hora: "18:12",
    status: "Encerrado",
    pontos: 8,
    duracao: "5 minutos",
  },
  {
    id: "3",
    data: "18 de junho de 2026",
    hora: "21:04",
    status: "Ativo",
    pontos: 22,
    duracao: "Em andamento",
  },
];

export default function Historico() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#170327", "#2A0845", "#4A148C"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>Histórico</Text>
            <Text style={styles.subtitle}>Acompanhe seus alertas de SOS.</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Ionicons name="shield-checkmark" size={26} color="#EC4899" />
            <Text style={styles.summaryNumber}>3</Text>
            <Text style={styles.summaryLabel}>Alertas</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="checkmark-circle" size={26} color="#22C55E" />
            <Text style={styles.summaryNumber}>2</Text>
            <Text style={styles.summaryLabel}>Encerrados</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="radio-button-on" size={26} color="#FB7185" />
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Ativo</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Últimos alertas</Text>

        {alertas.map((alerta) => (
          <TouchableOpacity
            key={alerta.id}
            style={styles.alertCard}
            activeOpacity={0.85}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="shield" size={26} color="#EC4899" />
              <Text style={styles.sosText}>SOS</Text>
            </View>

            <View style={styles.alertInfo}>
              <Text style={styles.alertDate}>
                {alerta.data} às {alerta.hora}
              </Text>

              <View style={styles.alertRow}>
                <Ionicons name="location-outline" size={16} color="#C084FC" />
                <Text style={styles.alertText}>{alerta.pontos} pontos registrados</Text>
              </View>

              <View style={styles.alertRow}>
                <Ionicons name="time-outline" size={16} color="#C084FC" />
                <Text style={styles.alertText}>Duração: {alerta.duracao}</Text>
              </View>
            </View>

            <View
              style={[
                styles.statusPill,
                alerta.status === "Ativo" && styles.statusPillActive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  alerta.status === "Ativo" && styles.statusTextActive,
                ]}
              >
                {alerta.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.tipCard}>
          <Ionicons name="information-circle" size={28} color="#C084FC" />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Sua segurança em primeiro lugar</Text>
            <Text style={styles.tipText}>
              Os alertas ficam disponíveis para consulta durante o período definido
              pelo sistema.
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 58,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
    gap: 14,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },

  subtitle: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },

  summaryCard: {
    flex: 1,
    minHeight: 118,
    borderRadius: 24,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },

  summaryLabel: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 12,
    marginTop: 2,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },

  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },

  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(236,72,153,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  sosText: {
    color: "#EC4899",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
  },

  alertInfo: {
    flex: 1,
  },

  alertDate: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8,
  },

  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },

  alertText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
  },

  statusPill: {
    backgroundColor: "rgba(34,197,94,0.16)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  statusPillActive: {
    backgroundColor: "rgba(251,113,133,0.18)",
  },

  statusText: {
    color: "#86EFAC",
    fontSize: 11,
    fontWeight: "900",
  },

  statusTextActive: {
    color: "#FB7185",
  },

  tipCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(168,85,247,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 18,
    marginTop: 8,
    marginBottom: 34,
  },

  tipTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  tipText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    lineHeight: 19,
  },
});