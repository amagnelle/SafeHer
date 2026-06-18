import {
  escutarNotificacoes,
  marcarNotificacaoComoLida,
  Notificacao,
} from "@/services/notification";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Notificacoes() {
  const [lista, setLista] = useState<Notificacao[]>([]);
  const router = useRouter();

  const notificacoesNaoLidas = lista.filter(
    (notificacao) => !notificacao.lida,
  ).length;

  useEffect(() => {
    const unsubscribe = escutarNotificacoes((lista) => {
      console.log("Notificações recebidas:", lista);
      setLista(lista);
    });

    return () => unsubscribe();
  }, []);

  function formatarHorario(criadaEm: any) {
    if (!criadaEm) return "";

    const data = criadaEm.toDate ? criadaEm.toDate() : new Date(criadaEm);

    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <LinearGradient
      colors={["#170327", "#2A0845", "#4A148C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.icon}>🔔</Text>

        <Text style={styles.title}>
          Notificações{" "}
          {notificacoesNaoLidas > 0 ? `(${notificacoesNaoLidas})` : ""}
        </Text>

        <Text style={styles.subtitle}>
          Acompanhe alertas recebidos dos seus guardiões.
        </Text>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyText}>
              Quando algum guardião enviar um alerta, ele aparecerá aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.lida && styles.cardUnread]}
            onPress={async () => {
              console.log("Alerta ID:", item.alertaId);

              await marcarNotificacaoComoLida(item.id);

              router.push(`/alerta/${item.alertaId}`);
            }}
          >
            <View style={styles.cardTop}>
              <View style={styles.alertBadge}>
                <View style={styles.alertDot} />
                <Text style={styles.alertBadgeText}>SOS</Text>
              </View>

              <View style={styles.cardRight}>
                {!item.lida && <View style={styles.unreadDot} />}

                <Text style={styles.cardTime}>
                  {formatarHorario(item.criadaEm)}
                </Text>
              </View>
            </View>

            <Text style={styles.titulo}>{item.titulo}</Text>

            <Text style={styles.mensagem}>{item.mensagem}</Text>

            <Text style={styles.remetente}>{item.remetenteNome}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "300",
  },

  header: {
    marginBottom: 28,
  },

  icon: {
    fontSize: 34,
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.70)",
    fontSize: 14,
    lineHeight: 20,
  },

  listContent: {
    paddingBottom: 40,
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },

  cardUnread: {
    borderColor: "rgba(225,29,72,0.35)",
    backgroundColor: "rgba(255,255,255,0.11)",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardTime: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "700",
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E11D48",
  },

  alertBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(225,29,72,0.14)",
    borderWidth: 1,
    borderColor: "rgba(225,29,72,0.24)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E11D48",
    marginRight: 7,
  },

  alertBadgeText: {
    color: "#FB7185",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  mensagem: {
    marginTop: 8,
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    lineHeight: 20,
  },

  remetente: {
    marginTop: 12,
    color: "#C084FC",
    fontSize: 13,
    fontWeight: "800",
  },

  emptyContainer: {
    marginTop: 90,
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyIcon: {
    fontSize: 44,
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  emptyText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.64)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});