import { escutarNotificacoes, Notificacao } from "@/services/notification";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SOSMap from "../components/SOSmap";
import { registrarPushToken } from "../services/pushNotifications";
import { auth, db } from "../src/models/firebaseConfig";

export default function Home() {
  const router = useRouter();

  const [sosActive, setSosActive] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");

  const [modalSOSVisible, setModalSOSVisible] = useState(false);
  const [notificacaoSOS, setNotificacaoSOS] = useState<Notificacao | null>(
    null,
  );

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const primeiraLeituraNotificacoes = useRef(true);
  const ultimaNotificacaoExibida = useRef<string | null>(null);

  const handleLogout = async () => {
    if (sosActive) {
      setErrorMessage("Encerre o alerta SOS antes de sair da sua conta.");
      setErrorModalVisible(true);
      return;
    }

    setLogoutModalVisible(true);
  };

  const confirmarLogout = async () => {
    try {
      await signOut(auth);
      setLogoutModalVisible(false);
      router.replace("/");
    } catch (error) {
      console.log(error);
      setLogoutModalVisible(false);
      setErrorMessage("Não foi possível sair.");
      setErrorModalVisible(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        // Push Token
        try {
          const token = await registrarPushToken();

          if (token) {
            await updateDoc(doc(db, "users", user.uid), {
              expoPushToken: token,
            });

            console.log("Push token salvo!");
          }
        } catch {
          console.log("Push Notification ainda não configurada.");
        }

        // Buscar dados do usuário
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const dados = userSnap.data();

          console.log("Dados usuário:", dados);

          setNomeUsuario(dados.nome || "");
        }
      } catch (error) {
        console.log("Erro ao carregar usuário:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = escutarNotificacoes((lista) => {
      if (!lista.length) return;

      const ultima = lista[0];

      if (!ultima?.alertaId) return;

      // Ignora notificações antigas carregadas ao abrir a Home
      if (primeiraLeituraNotificacoes.current) {
        primeiraLeituraNotificacoes.current = false;
        ultimaNotificacaoExibida.current = ultima.id;
        return;
      }

      // Não mostra novamente a mesma notificação
      if (ultima.id === ultimaNotificacaoExibida.current) return;

      // Se já foi lida, não abre modal
      if (ultima.lida) return;

      ultimaNotificacaoExibida.current = ultima.id;

      setNotificacaoSOS(ultima);
      setModalSOSVisible(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <LinearGradient
      colors={["#170327", "#2A0845", "#4A148C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />

            <Text style={styles.logo}>SafeHer</Text>
          </View>

          <Text style={styles.greeting}>
            Olá, {nomeUsuario ? nomeUsuario.split(" ")[0] : "..."}
          </Text>

          <Text style={styles.subtitle}>Tudo pronto para cuidar de você.</Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/perfil")}
        >
          <Text style={styles.profileText}>
            {nomeUsuario ? nomeUsuario.charAt(0).toUpperCase() : "S"}
          </Text>
        </TouchableOpacity>
      </View>

      {!sosActive && (
        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View>
              <Text style={styles.statusTitle}>Sistema protegido</Text>
              <Text style={styles.statusText}>
                GPS pronto para compartilhamento.
              </Text>
            </View>

            <View style={styles.statusDot} />
          </View>
        </View>
      )}

      <View style={styles.sosContainer}>
        {sosActive ? (
          <SOSMap onEndAlert={() => setSosActive(false)} />
        ) : (
          <View style={styles.sosArea}>
            <View style={styles.sosPulseOuter}>
              <View style={styles.sosPulseMiddle}>
                <TouchableOpacity
                  style={styles.sosButton}
                  onPress={() => setSosActive(true)}
                >
                  <Text style={styles.sosText}>SOS</Text>
                  <Text style={styles.sosSubtext}>Emergência</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sosHelpText}>
              Toque para iniciar o alerta e registrar seu trajeto.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardsArea}>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/contatos")}
          >
            <Text style={styles.cardEmoji}>👥</Text>
            <Text style={styles.cardTitle}>Guardiões</Text>
            <Text style={styles.cardLink}>Configurar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/notificacoes")}
          >
            <Text style={styles.cardEmoji}>🔔</Text>
            <Text style={styles.cardTitle}>Alertas</Text>
            <Text style={styles.cardLink}>Ver avisos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push("/")}>
            <Text style={styles.cardEmoji}>📍</Text>
            <Text style={styles.cardTitle}>Trajetos</Text>
            <Text style={styles.cardLink}>Histórico</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalSOSVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalSOSVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sosModal}>
            <View style={styles.modalBadge}>
              <View style={styles.modalLiveDot} />
              <Text style={styles.modalBadgeText}>SOS RECEBIDO</Text>
            </View>

            <Text style={styles.sosModalTitle}>
              {notificacaoSOS?.titulo ?? "Alerta SOS"}
            </Text>

            <Text style={styles.sosModalMessage}>
              {notificacaoSOS?.mensagem ?? "Um contato acionou um alerta SOS."}
            </Text>

            <Text style={styles.sosModalSender}>
              {notificacaoSOS?.remetenteNome ?? "SafeHer"}
            </Text>

            <TouchableOpacity
              style={styles.sosModalPrimaryButton}
              onPress={() => {
                setModalSOSVisible(false);

                if (notificacaoSOS?.alertaId) {
                  router.push(`/alerta/${notificacaoSOS.alertaId}`);
                }
              }}
            >
              <Text style={styles.sosModalPrimaryText}>Acompanhar agora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sosModalSecondaryButton}
              onPress={() => {
                setModalSOSVisible(false);
                router.push("/notificacoes");
              }}
            >
              <Text style={styles.sosModalSecondaryText}>
                Ir para notificações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sosModalCloseButton}
              onPress={() => setModalSOSVisible(false)}
            >
              <Text style={styles.sosModalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sosModal}>
            <Text style={styles.sosModalTitle}>Sair da conta?</Text>

            <Text style={styles.sosModalMessage}>
              Deseja realmente encerrar sua sessão?
            </Text>

            <TouchableOpacity
              style={styles.sosModalPrimaryButton}
              onPress={confirmarLogout}
            >
              <Text style={styles.sosModalPrimaryText}>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sosModalSecondaryButton}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Text style={styles.sosModalSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={errorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sosModal}>
            <Text style={styles.sosModalTitle}>Atenção</Text>

            <Text style={styles.sosModalMessage}>{errorMessage}</Text>

            <TouchableOpacity
              style={styles.sosModalPrimaryButton}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={styles.sosModalPrimaryText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginTop: 62,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },

  greeting: {
    fontSize: 25,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 24,
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.72)",
    marginTop: 6,
  },

  profileButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  statusCard: {
    marginHorizontal: 24,
    marginTop: 22,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
  },

  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  statusText: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 13,
    marginTop: 4,
  },

  statusDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#4ADE80",
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },

  sosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sosArea: {
    alignItems: "center",
  },

  sosPulseOuter: {
    width: 252,
    height: 252,
    borderRadius: 126,
    backgroundColor: "rgba(255,255,255,0.045)",
    alignItems: "center",
    justifyContent: "center",
  },

  sosPulseMiddle: {
    width: 218,
    height: 218,
    borderRadius: 109,
    backgroundColor: "rgba(255,255,255,0.075)",
    alignItems: "center",
    justifyContent: "center",
  },

  sosButton: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: "#FF1744",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF1744",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 26,
    elevation: 20,
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 50,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sosSubtext: {
    color: "rgba(255,255,255,0.92)",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
  },

  sosHelpText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
    marginTop: 20,
    textAlign: "center",
  },

  cardsArea: {
    marginBottom: 34,
    paddingHorizontal: 22,
  },

  grid: {
    flexDirection: "row",
    gap: 10,
  },

  card: {
    flex: 1,
    minHeight: 104,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    padding: 14,
    borderRadius: 20,
    justifyContent: "center",
  },

  cardEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  cardLink: {
    color: "rgba(255,255,255,0.62)",
    marginTop: 6,
    fontSize: 12,
  },

  logoutButton: {
    marginTop: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  sosModal: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#1E1233",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  modalBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(225,29,72,0.14)",
    borderWidth: 1,
    borderColor: "rgba(225,29,72,0.24)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 18,
  },

  modalLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E11D48",
    marginRight: 8,
  },

  modalBadgeText: {
    color: "#FB7185",
    fontSize: 11,
    fontWeight: "900",
  },

  sosModalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  sosModalMessage: {
    marginTop: 10,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 22,
  },

  sosModalSender: {
    marginTop: 14,
    marginBottom: 22,
    color: "#C084FC",
    fontWeight: "800",
  },

  sosModalPrimaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#E11D48",
    justifyContent: "center",
    alignItems: "center",
  },

  sosModalPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  sosModalSecondaryButton: {
    height: 56,
    borderRadius: 18,
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  sosModalSecondaryText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  sosModalCloseButton: {
    alignItems: "center",
    marginTop: 16,
  },

  sosModalCloseText: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "700",
  },
});