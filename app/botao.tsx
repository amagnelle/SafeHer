import SOSMap from "@/components/SOSmap";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const [sosActive, setSosActive] = useState(false);

  return (
    <LinearGradient
      colors={["#D8B4FE", "#A855F7", "#7E22CE", "#581C87"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>SafeHer</Text>
          <Text style={styles.greeting}>Olá, Nelle</Text>
          <Text style={styles.subtitle}>
            Bem-vinda ao seu espaço de segurança.
          </Text>
        </View>

        <TouchableOpacity style={styles.bell}>
          <Text style={styles.bellText}>🔔</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sosContainer}>
        {sosActive ? (
          <SOSMap onEndAlert={() => setSosActive(false)} />
        ) : (
          <TouchableOpacity
            style={styles.sosButton}
            onPress={() => setSosActive(true)}
          >
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSubtext}>Ação rápida</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardsArea}>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Contatos</Text>
            <Text style={styles.cardLink}>Configurar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Histórico</Text>
            <Text style={styles.cardLink}>Ver histórico</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 70,
  },

  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  greeting: {
    marginTop: 38,
    fontSize: 27,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.78)",
    marginTop: 6,
  },

  bell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  bellText: {
    fontSize: 24,
  },

  sosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sosButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#FF1744",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#e70c0c",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.75,
    shadowRadius: 28,

    elevation: 20,
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sosSubtext: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 8,
    opacity: 0.9,
  },

  cardsArea: {
    marginBottom: 42,
  },

  grid: {
    flexDirection: "row",
    gap: 14,
  },

  card: {
    flex: 1,
    minHeight: 112,
    borderRadius: 22,
    padding: 20,
    justifyContent: "center",

    backgroundColor: "rgba(101, 101, 102, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.57)",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  cardLink: {
    marginTop: 10,
    color: "rgba(255,255,255,0.82)",
    fontSize: 16,
    fontWeight: "500",
  },

  logoutButton: {
    marginTop: 30,
    marginBottom: 50,
    paddingVertical: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
