import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../src/models/firebaseConfig";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

type Alerta = {
  id: string;
  status: string;
  iniciadoEm: any;
  encerradoEm: any;
  ultimaLocalizacao: {
    latitude: number;
    longitude: number;
    accuracy: number;
    atualizadoEm: string;
  } | null;
  quantidadePontos: number;
  duracao: string;
};

export default function Historico() {
  const router = useRouter();

  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Escuta ativamente quando o usuário está realmente pronto e logado
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      carregarHistorico();
    } else {
      setLoading(false); // Desativa o loading caso não tenha usuário logado
    }
  });

  return unsubscribe; // Limpa o listener ao desmontar a tela
}, []);

  async function carregarHistorico() {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Otimização: Filtra direto no Firestore apenas os alertas do usuário logado
      const alertasQuery = query(
        collection(db, "alertas"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(alertasQuery);
      
      // Remove ou comenta esses alerts em produção, servem para debugar
      // alert(`Documentos do usuário no Firestore: ${snapshot.size}`);

      // 2. Mapeia os documentos retornados buscando as subcoleções de forma segura
      const lista = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const dados: any = docSnap.data();

          // Busca a subcoleção de trajetos para cada alerta filtrado
          const trajeto = await getDocs(
            collection(db, "alertas", docSnap.id, "trajeto")
          );

          let duracao = "Em andamento";

          if (dados.iniciadoEm) {
            // Garante que o método toDate() existe antes de chamar
            const inicio = typeof dados.iniciadoEm.toDate === "function" 
              ? dados.iniciadoEm.toDate() 
              : new Date(dados.iniciadoEm);

            const fim = dados.encerradoEm
              ? (typeof dados.encerradoEm.toDate === "function" ? dados.encerradoEm.toDate() : new Date(dados.encerradoEm))
              : new Date();

            const minutos = Math.floor(
              (fim.getTime() - inicio.getTime()) / 60000
            );

            duracao = `${minutos} minutos`;
          }

          return {
            id: docSnap.id,
            ...dados,
            quantidadePontos: trajeto.size,
            duracao,
          };
        })
      );

      // Ordena os alertas para mostrar os mais recentes primeiro (opcional, mas recomendado)
      lista.sort((a, b) => {
        const dataA = a.iniciadoEm?.toDate ? a.iniciadoEm.toDate().getTime() : 0;
        const dataB = b.iniciadoEm?.toDate ? b.iniciadoEm.toDate().getTime() : 0;
        return dataB - dataA;
      });

      setAlertas(lista as Alerta[]);
    } catch (e) {
      console.error("Erro ao carregar histórico: ", e);
      alert("Erro ao carregar histórico. Verifique o console.");
    } finally {
      setLoading(false);
    }
  }

  const totalAlertas = alertas.length;

  const ativos = alertas.filter(
    (a) => a.status === "ativo"
  ).length;

  const encerrados = alertas.filter(
    (a) => a.status === "encerrado"
  ).length;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#170327",
        }}
      >
        <Text style={{ color: "#fff" }}>
          Carregando histórico...
        </Text>
      </View>
    );
  }

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
            <Text style={styles.summaryNumber}>{totalAlertas}</Text>
            <Text style={styles.summaryLabel}>Alertas</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="checkmark-circle" size={26} color="#22C55E" />
            <Text style={styles.summaryNumber}>{encerrados}</Text>
            <Text style={styles.summaryLabel}>Encerrados</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="radio-button-on" size={26} color="#FB7185" />
            <Text style={styles.summaryNumber}>{ativos}</Text>
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
    {alerta.iniciadoEm?.toDate().toLocaleString("pt-BR")}
  </Text>

  <View style={styles.alertRow}>
    <Ionicons
      name="location-outline"
      size={16}
      color="#C084FC"
    />
    <Text style={styles.alertText}>
      {alerta.quantidadePontos} pontos registrados
    </Text>
  </View>

  <View style={styles.alertRow}>
    <Ionicons
      name="time-outline"
      size={16}
      color="#C084FC"
    />
    <Text style={styles.alertText}>
      Duração: {alerta.duracao}
    </Text>
  </View>

  {alerta.ultimaLocalizacao && (
    <View style={styles.alertRow}>
      <Ionicons
        name="navigate-outline"
        size={16}
        color="#C084FC"
      />
      <Text style={styles.alertText}>
        {alerta.ultimaLocalizacao.latitude.toFixed(5)},
        {" "}
        {alerta.ultimaLocalizacao.longitude.toFixed(5)}
      </Text>
    </View>
  )}
</View>

<View
  style={[
    styles.statusPill,
    alerta.status === "ativo" &&
      styles.statusPillActive,
  ]}
>
  <Text
    style={[
      styles.statusText,
      alerta.status === "ativo" &&
        styles.statusTextActive,
    ]}
  >
    {alerta.status === "ativo"
      ? "Ativo"
      : "Encerrado"}
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