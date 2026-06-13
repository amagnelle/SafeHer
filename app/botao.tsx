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

  //controla se o SOS está ativo (mostra mapa ou botão)
  const [sosActive, setSosActive] = useState(false);

  // guarda o nome do usuário vindo do Firestore
  const [nomeUsuario, setNomeUsuario] = useState("");

  
  const handleLogout = () => {
    // segurança: não deixa sair com SOS ativo
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
            // encerra sessão Firebase
            await signOut(auth);

            // volta para tela inicial
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
        // pega usuário logado do Firebase Auth
        const user = auth.currentUser;

    
        if (!user) return;

        
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);


        if (userSnap.exists() && ativo) {
          const dados = userSnap.data();

          // salva nome pra UI
          setNomeUsuario(dados.nome || "");
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
      </View>

     
      <View style={styles.sosContainer}>
        {sosActive ? (
          // quando SOS ativo, mostra mapa/controle
          <SOSMap onEndAlert={() => setSosActive(false)} />
        ) : (
          // botão principal de ativação do SOS
          <TouchableOpacity
            style={styles.sosButton}
            onPress={() => setSosActive(true)}
          >
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSubtext}>Ação rápida</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CARDS MENU */}
      <View style={styles.cardsArea}>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/contatos")}
          >
            <Text style={styles.cardTitle}>Contatos</Text>
            <Text style={styles.cardLink}>Configurar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/")}
          >
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
  },

  header: {
    marginTop: 60,
    paddingHorizontal: 20,
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },

  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },

  sosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sosButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#FF1744",
    justifyContent: "center",
    alignItems: "center",
  },

  sosText: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "900",
  },

  sosSubtext: {
    color: "#fff",
    marginTop: 8,
  },

  cardsArea: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },

  grid: {
    flexDirection: "row",
    gap: 12,
  },

  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 16,
    borderRadius: 16,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  cardLink: {
    color: "#ddd",
    marginTop: 6,
  },

  logoutButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});