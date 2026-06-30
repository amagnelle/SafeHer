import { Ionicons } from "@expo/vector-icons";
import { db } from "@/src/models/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

interface Point {
  latitude: number;
  longitude: number;
}

export default function Alerta() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [alerta, setAlerta] = useState<any>(null);
  const [rota, setRota] = useState<Point[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState("Usuária SafeHer");

  const mapRef = useRef<MapView | null>(null);
  const ultimaAnimacaoRef = useRef<number>(0);

  useEffect(() => {
    if (!id) return;

    const alertaRef = doc(db, "alertas", String(id));

    const unsubscribeAlerta = onSnapshot(alertaRef, (snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.data();

        setAlerta(dados);
        setNomeUsuario(dados.nomeUsuario || "Usuária SafeHer");
      }
    });

    const trajetoRef = query(
      collection(db, "alertas", String(id), "trajeto"),
      orderBy("criadoEm", "asc")
    );

    const unsubscribeTrajeto = onSnapshot(trajetoRef, (snapshot) => {
      const pontos = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      });

      setRota(pontos);
    });

    return () => {
      unsubscribeAlerta();
      unsubscribeTrajeto();
    };
  }, [id]);

  const localizacaoAtual = alerta?.ultimaLocalizacao
    ? {
        latitude: alerta.ultimaLocalizacao.latitude,
        longitude: alerta.ultimaLocalizacao.longitude,
      }
    : rota.length > 0
      ? rota[rota.length - 1]
      : null;

  useEffect(() => {
    if (!localizacaoAtual) return;

    const agora = Date.now();

    if (agora - ultimaAnimacaoRef.current < 3500) return;

    ultimaAnimacaoRef.current = agora;

    mapRef.current?.animateToRegion(
      {
        latitude: localizacaoAtual.latitude,
        longitude: localizacaoAtual.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      1200
    );
  }, [localizacaoAtual]);

  function abrirNoGoogleMaps() {
    if (!localizacaoAtual) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${localizacaoAtual.latitude},${localizacaoAtual.longitude}`;

    Linking.openURL(url);
  }

  if (!alerta || !localizacaoAtual) {
    return (
      <LinearGradient
        colors={["#170327", "#2A0845", "#4A148C"]}
        style={styles.container}
      >
        <View style={styles.loadingBox}>
          <Ionicons name="location" size={48} color="#FFFFFF" />
          <Text style={styles.loading}>Carregando alerta...</Text>
          <Text style={styles.loadingText}>
            Aguardando a primeira localização em tempo real.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#170327", "#2A0845", "#4A148C"]}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.badge}>SOS ATIVO</Text>
        <Text style={styles.title}>Alerta de {nomeUsuario.split(" ")[0]}</Text>
        <Text style={styles.subtitle}>
          Acompanhe a localização compartilhada em tempo real.
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          loadingEnabled
          initialRegion={{
            latitude: localizacaoAtual.latitude,
            longitude: localizacaoAtual.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
        >
          <Marker
            coordinate={localizacaoAtual}
            title="Localização atual"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userMarkerOuter}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>

          {rota.length > 1 && (
            <Polyline
              coordinates={rota}
              strokeWidth={5}
              strokeColor="#EC4899"
            />
          )}
        </MapView>

        <View style={styles.mapOverlay} pointerEvents="none" />

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>
            {alerta.status === "ativo" ? "AO VIVO" : "ENCERRADO"}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View>
            <Text style={styles.infoTitle}>Compartilhamento ativo</Text>
            <Text style={styles.infoSubtitle}>
              {alerta.status === "ativo"
                ? "A localização continua sendo atualizada."
                : "Este alerta foi encerrado."}
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              alerta.status !== "ativo" && styles.statusPillEnded,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                alerta.status !== "ativo" && styles.statusPillEndedText,
              ]}
            >
              {alerta.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Pontos registrados</Text>
          <Text style={styles.rowValue}>{rota.length}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Latitude</Text>
          <Text style={styles.rowValue}>
            {localizacaoAtual.latitude.toFixed(5)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Longitude</Text>
          <Text style={styles.rowValue}>
            {localizacaoAtual.longitude.toFixed(5)}
          </Text>
        </View>

        <TouchableOpacity style={styles.mapsButton} onPress={abrirNoGoogleMaps}>
          <Text style={styles.mapsButtonText}>Abrir no Google Maps</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 62,
    paddingBottom: 30,
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
    marginBottom: 18,
  },

  badge: {
    color: "#FB7185",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },

  mapContainer: {
    width: "100%",
    height: 330,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#170327",
    marginBottom: 18,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(23,3,39,0.12)",
  },

  userMarkerOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(236,72,153,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },

  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EC4899",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  liveBadge: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(23,3,39,0.86)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },

  liveDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E11D48",
    marginRight: 8,
  },

  liveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 26,
    padding: 18,
  },

  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  infoTitle: {
    color: "#581C87",
    fontSize: 21,
    fontWeight: "900",
  },

  infoSubtitle: {
    color: "#4B5563",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 19,
    maxWidth: 220,
  },

  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(34,197,94,0.14)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusPillEnded: {
    backgroundColor: "rgba(107,114,128,0.14)",
  },

  statusPillText: {
    color: "#16A34A",
    fontSize: 11,
    fontWeight: "900",
  },

  statusPillEndedText: {
    color: "#6B7280",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(88,28,135,0.10)",
    marginVertical: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  rowLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },

  rowValue: {
    color: "#581C87",
    fontSize: 13,
    fontWeight: "900",
  },

  mapsButton: {
    marginTop: 10,
    backgroundColor: "#A855F7",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  mapsButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingIcon: {
    fontSize: 44,
    marginBottom: 16,
  },

  loading: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  loadingText: {
    color: "rgba(255,255,255,0.68)",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});