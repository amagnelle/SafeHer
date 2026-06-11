import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import {
  encerrarAlerta,
  iniciarAlerta,
  salvarPontoDoTrajeto,
} from "@/services/sosService";

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
        setAlertaId(novoAlertaId);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 5,
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
        <Text style={styles.loadingText}>Ativando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title="Você está aqui" />

        {route.length > 1 && (
          <Polyline coordinates={route} strokeWidth={5} strokeColor="#7E22CE" />
        )}
      </MapView>

      <View style={styles.alertBox}>
        <Text style={styles.alertTitle}>SOS ativo</Text>

        <Text style={styles.alertText}>
          Sua localização está sendo acompanhada em tempo real.
        </Text>

        <TouchableOpacity style={styles.endButton} onPress={handleEndAlert}>
          <Text style={styles.endButtonText}>Encerrar alerta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    marginVertical: 24,
  },

  map: {
    flex: 1,
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  alertBox: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 22,
    padding: 18,
  },

  alertTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#581C87",
  },

  alertText: {
    marginTop: 6,
    fontSize: 14,
    color: "#4B5563",
  },

  endButton: {
    marginTop: 14,
    backgroundColor: "#E11D48",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  endButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
