import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import SOSMap from "../components/SOSmap";
import { auth, db } from "../src/models/firebaseConfig";

export default function Home() {
  const router = useRouter();

  const [sosActive, setSosActive] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");

  const handleLogout = () => {
    if (sosActive) {
      Alert.alert("SOS ativo", "Encerre o alerta SOS antes de sair da conta.");
      return;
    }

    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/");
          } catch (error) {
            console.log("Erro ao sair:", error);
            Alert.alert("Erro", "Não foi possível sair.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        const user = auth.currentUser;

        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && ativo) {
          setNomeUsuario(userSnap.data().nome);
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      }
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);
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

          <Text style={styles.greeting}>
            Olá, {nomeUsuario ? nomeUsuario.split(" ")[0] : "..."}
          </Text>

          <Text style={styles.subtitle}>
            Bem-vinda ao seu espaço de segurança.
          </Text>
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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
