import { enviarNotificacaoSOS } from "@/services/notification";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MapView, {
  MapStyleElement,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import {
  encerrarAlerta,
  iniciarAlerta,
  salvarPontoDoTrajeto,
} from "@/services/sosService";

const mapStyle: MapStyleElement[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#d5d4d6" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#fbfaff" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#292929" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#9d86c4" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#818099" }],
  },
];

interface Point {
  latitude: number;
  longitude: number;
}

interface SOSMapProps {
  onEndAlert: () => void;
}

export default function SOSMap({ onEndAlert }: SOSMapProps) {
  const [location, setLocation] = useState<Point | null>(null);
  const [route, setRoute] = useState<Point[]>([]);
  const [alertaId, setAlertaId] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startTracking() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          alert("Permissão de localização negada.");
          onEndAlert();
          return;
        }

        const novoAlertaId = await iniciarAlerta();

        await enviarNotificacaoSOS(novoAlertaId);

        setAlertaId(novoAlertaId);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 3,
          },
          async (currentLocation) => {
            const newPoint = {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            };

            setLocation(newPoint);
            setRoute((prev) => [...prev, newPoint]);

            await salvarPontoDoTrajeto(novoAlertaId, {
              latitude: newPoint.latitude,
              longitude: newPoint.longitude,
              accuracy: currentLocation.coords.accuracy,
            });
          },
        );
      } catch (error) {
        console.log("Erro ao iniciar SOS:", error);
        alert("Erro ao iniciar o alerta SOS.");
        onEndAlert();
      }
    }

    startTracking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  async function handleEndAlert() {
    try {
      if (alertaId) {
        await encerrarAlerta(alertaId);
      }

      onEndAlert();
    } catch (error) {
      console.log("Erro ao encerrar alerta:", error);
      alert("Erro ao encerrar alerta.");
    }
  }

  if (!location) {
    return (
      <View style={styles.loadingBox}>
        <View style={styles.loadingPulse}>
          <Text style={styles.loadingIcon}>📍</Text>
        </View>

        <Text style={styles.loadingText}>Ativando localização...</Text>
        <Text style={styles.loadingSubtext}>
          Preparando o compartilhamento em tempo real.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={styles.map}
        loadingEnabled
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
      >
        <Marker
          coordinate={location}
          title="Você está aqui"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.userMarkerOuter}>
            <View style={styles.userMarkerInner} />
          </View>
        </Marker>

        {route.length > 1 && (
          <Polyline coordinates={route} strokeWidth={5} strokeColor="#EC4899" />
        )}
      </MapView>

      <View pointerEvents="none" style={styles.mapOverlay} />

      <View style={styles.topBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.topBadgeText}>ALERTA SOS ATIVO</Text>
      </View>

      <View style={styles.alertBox}>
        <View style={styles.alertHeader}>
          <View>
            <Text style={styles.alertTitle}>Compartilhamento ativo</Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Online</Text>
          </View>
        </View>

        <View style={styles.infoLine} />

        <TouchableOpacity style={styles.endButton} onPress={handleEndAlert}>
          <Text style={styles.endButtonText}>Encerrar SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 520,
    borderRadius: 0,
    overflow: "visible",
    marginVertical: 20,
    backgroundColor: "#423d46",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(23,3,39,0.16)",
  },

  userMarkerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(236,72,153,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },

  userMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EC4899",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  loadingBox: {
    width: "100%",
    height: 520,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginVertical: 20,
  },

  loadingPulse: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(236,72,153,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  loadingIcon: {
    fontSize: 34,
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  loadingSubtext: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 18,
  },

  topBadge: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(23,3,39,0.86)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    zIndex: 2,
  },

  liveDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#FF1744",
    marginRight: 8,
  },

  topBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  alertBox: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 26,
    padding: 18,
    zIndex: 2,
  },

  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  alertTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#581C87",
  },

  alertText: {
    marginTop: 6,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 19,
    maxWidth: 230,
  },

  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(34,197,94,0.14)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusPillText: {
    color: "#16A34A",
    fontSize: 11,
    fontWeight: "900",
  },

  infoLine: {
    height: 1,
    backgroundColor: "rgba(88,28,135,0.10)",
    marginVertical: 14,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },

  infoValue: {
    color: "#581C87",
    fontSize: 15,
    fontWeight: "900",
  },

  endButton: {
    marginTop: 16,
    backgroundColor: "#E11D48",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  endButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
