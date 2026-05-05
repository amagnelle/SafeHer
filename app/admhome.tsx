import { BrazilMapPurple } from "@/components/BrazilMapPurple";
import { ClickDistributionChart } from "@/components/ClickDistributionChart";
import { Last7DaysChart } from "@/components/Last7DaysChart";
import { StatCard } from "@/components/StatCard";
import {
  brazilStatesData,
  calculatePercentage,
  getTopStates,
  getTotalClicks,
  StateData,
} from "@/lib/brazilGeoData";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const totalClicks = getTotalClicks(brazilStatesData);
  const topStates = getTopStates(brazilStatesData, 5);
  const uniqueUsers = Math.round(totalClicks * 0.67);
  const avgClicksPerDay = Math.round(totalClicks / 7);

  const clickRate = uniqueUsers
    ? (totalClicks / (uniqueUsers * 1.5)).toFixed(1)
    : "0.0";

  const distributionData = [
    { name: "Links", value: 680, percentage: 68 },
    { name: "Visualizações", value: 220, percentage: 22 },
    { name: "Outros", value: 100, percentage: 10 },
  ];

  const last7DaysData = [
    { day: "Seg", clicks: 38 },
    { day: "Ter", clicks: 58 },
    { day: "Qua", clicks: 32 },
    { day: "Qui", clicks: 48 },
    { day: "Sex", clicks: 35 },
    { day: "Sab", clicks: 52 },
    { day: "Dom", clicks: 62 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-purple-300">Estatísticas de Cliques</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard icon={<BarChart3 />} title="Total" value={totalClicks} />
          <StatCard icon={<Users />} title="Usuários" value={uniqueUsers} />
          <StatCard icon={<TrendingUp />} title="Média" value={avgClicksPerDay} />
          <StatCard icon={<Zap />} title="Taxa" value={`${clickRate}%`} />
        </div>

        {/* Mapa */}
        <div className="h-96">
          <BrazilMapPurple
            states={brazilStatesData}
            onStateClick={setSelectedState}
          />
        </div>

        {/* Gráfico */}
        <Last7DaysChart data={last7DaysData} />

        {/* Estado selecionado */}
        {selectedState && (
          <div className="mt-6 text-white">
            <h2 className="text-xl">{selectedState.name}</h2>
            <p>
              {calculatePercentage(selectedState.clicks, totalClicks)}% dos
              cliques
            </p>
          </div>
        )}
      </div>
    </div>
  );
}