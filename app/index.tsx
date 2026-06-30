import PermissionIntroModal from "@/components/PermissionIntroModal";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Welcome() {
  const router = useRouter();

  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  useEffect(() => {
    setPermissionModalVisible(true);
  }, []);

  async function solicitarPermissoes() {
    setPermissionModalVisible(false);

    await Location.requestForegroundPermissionsAsync();

    if (Platform.OS !== "web") {
      await Notifications.requestPermissionsAsync();
    }
  }

  return (
    <ImageBackground
      source={require("@/assets/images/fundo.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <PermissionIntroModal
        visible={permissionModalVisible}
        onContinue={solicitarPermissoes}
        onClose={() => setPermissionModalVisible(false)}
      />

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.brand}>SafeHer</Text>

          <Text style={styles.title}>Nunca caminhe sozinha.</Text>

          <Text style={styles.subtitle}>
            Proteção inteligente para você e quem importa.
          </Text>

          <View style={styles.featuresCard}>
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Alerta rápido</Text>
              <Text style={styles.featureText}>em emergências</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Localização</Text>
              <Text style={styles.featureText}>em tempo real</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Guardiões</Text>
              <Text style={styles.featureText}>de confiança</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryText}>Entrar</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/cadastro")}
          >
            <Text style={styles.secondaryText}>Criar conta</Text>
            <Text style={styles.secondaryArrow}>›</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Seus dados estão seguros. Privacidade em primeiro lugar.
          </Text>
        </View>
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
    backgroundColor: "rgba(8, 0, 25, 0.32)",
    paddingHorizontal: 26,
    paddingBottom: 36,
    justifyContent: "flex-end",
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  brand: {
    color: "#FFFFFF",
    fontSize: 46,
    fontWeight: "900",
    marginBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },

  featuresCard: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 26,
  },

  featureItem: {
    flex: 1,
    alignItems: "center",
  },

  featureTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  featureText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  primaryButton: {
    width: "100%",
    height: 64,
    borderRadius: 32,
    backgroundColor: "#A855F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  primaryText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 20,
  },

  arrow: {
    position: "absolute",
    right: 26,
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "300",
  },

  secondaryButton: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#D946EF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: "rgba(0,0,0,0.12)",
  },

  secondaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
  },

  secondaryArrow: {
    position: "absolute",
    right: 26,
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
  },

  footerText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 8,
  },
});