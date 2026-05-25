import {
  StateData,
  brazilStatesData,
  calculatePercentage,
  getTotalClicks,
} from "@/lib/brazilGeoData";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BrazilMapPurple } from "./BrasilMapaPurple";

export default function AdminHome() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const totalClicks = getTotalClicks(brazilStatesData);
  const uniqueUsers = Math.round(totalClicks * 0.67);
  const avgClicksPerDay = Math.round(totalClicks / 7);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View style={{ padding: 20, paddingTop: 50 }}>
        <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>
          Dashboard
        </Text>

        <Text style={{ color: "#c4b5fd", marginTop: 8 }}>
          Estatísticas de Cliques
        </Text>

        <View style={{ marginTop: 24, gap: 12 }}>
          <Card title="Total" value={totalClicks} />
          <Card title="Usuários" value={uniqueUsers} />
          <Card title="Média diária" value={avgClicksPerDay} />
        </View>

        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 12,
            }}
          >
            Cliques por Estado
          </Text>

          <BrazilMapPurple
            states={brazilStatesData}
            onStateClick={setSelectedState}
          />
        </View>

        {selectedState && (
          <View
            style={{
              marginTop: 24,
              backgroundColor: "#1e293b",
              padding: 16,
              borderRadius: 14,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
              {selectedState.name}
            </Text>

            <Text style={{ color: "#cbd5e1", marginTop: 6 }}>
              {selectedState.clicks} cliques •{" "}
              {calculatePercentage(selectedState.clicks, totalClicks)}%
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <View style={{ backgroundColor: "#1e293b", padding: 16, borderRadius: 14 }}>
      <Text style={{ color: "#94a3b8", fontSize: 14 }}>{title}</Text>
      <Text
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 4,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
