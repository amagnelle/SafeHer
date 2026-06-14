import { useState } from "react";

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

import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { useSOSContext } from "@/contexts/SOSContext";

export default function Home() {

  const [selectedState, setSelectedState] =
    useState<StateData | null>(null);

  // 🚨 PUXA OS CLIQUES DO BOTÃO SOS
  const {
    totalClicks: totalSOSClicks,
    sosClicks,
  } = useSOSContext();

  // cliques dos estados
  const statesClicks = getTotalClicks(brazilStatesData);

  // total geral
  const totalClicks = statesClicks + totalSOSClicks;

  // top estados
  const topStates = getTopStates(brazilStatesData, 5);

  // usuários únicos
  const uniqueUsers = Math.round(totalClicks * 0.67);

  // média diária
  const avgClicksPerDay = Math.round(totalClicks / 7);

  // taxa
  const clickRate = uniqueUsers
    ? (totalClicks / (uniqueUsers * 1.5)).toFixed(1)
    : "0.0";

  // gráfico donut
  const distributionData = [
    {
      name: "Links",
      value: 680,
      percentage: 68,
    },
    {
      name: "Visualizações",
      value: 220,
      percentage: 22,
    },
    {
      name: "SOS",
      value: totalSOSClicks,
      percentage: totalClicks
        ? Math.round(
            (totalSOSClicks / totalClicks) * 100
          )
        : 0,
    },
  ];

  // gráfico últimos 7 dias
  const last7DaysData = [
    { day: "Seg", clicks: 38 },
    { day: "Ter", clicks: 58 },
    { day: "Qua", clicks: 32 },
    { day: "Qui", clicks: 48 },
    { day: "Sex", clicks: 35 },
    { day: "Sab", clicks: 52 },
    {
      day: "Dom",
      clicks: 62 + totalSOSClicks,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      {/* header */}
      <div className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">

        <div className="mx-auto max-w-7xl px-4 py-8">

          <h1 className="text-4xl font-bold text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-purple-300">
            Estatísticas de Cliques
          </p>

          {/* total SOS */}
          <p className="mt-2 text-red-400 text-sm">
            🚨 Cliques SOS: {totalSOSClicks}
          </p>

        </div>

      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">

          <StatCard
            icon={<BarChart3 />}
            title="Total"
            value={totalClicks}
          />

          <StatCard
            icon={<Users />}
            title="Usuários"
            value={uniqueUsers}
          />

          <StatCard
            icon={<TrendingUp />}
            title="Média"
            value={avgClicksPerDay}
          />

          <StatCard
            icon={<Zap />}
            title="Taxa"
            value={`${clickRate}%`}
          />

        </div>

        {/* gráfico donut */}
        <div className="mb-8 rounded-xl bg-slate-800 p-6">

          <h2 className="text-white text-xl mb-4">
            Distribuição de Cliques
          </h2>

          <ClickDistributionChart
            data={distributionData}
          />

        </div>

        {/* mapa */}
        <div className="rounded-xl bg-slate-800 p-6 mb-8">

          <h2 className="text-white text-xl mb-4">
            Cliques por Estado
          </h2>

          <div className="h-96">

            <BrazilMapPurple
              states={brazilStatesData}
              onStateClick={setSelectedState}
            />

          </div>

        </div>

        {/* gráfico semanal */}
        <div className="rounded-xl bg-slate-800 p-6 mb-8">

          <h2 className="text-white text-xl mb-4">
            Últimos 7 Dias
          </h2>

          <Last7DaysChart
            data={last7DaysData}
          />

        </div>

        {/* histórico SOS */}
        <div className="rounded-xl bg-slate-800 p-6 mb-8">

          <h2 className="text-white text-xl mb-4">
            Histórico SOS
          </h2>

          {sosClicks.length === 0 ? (

            <p className="text-gray-400">
              Nenhum clique registrado.
            </p>

          ) : (

            <div className="space-y-3">

              {sosClicks
                .slice()
                .reverse()
                .map((click, index) => (

                  <div
                    key={click.id}
                    className="bg-slate-700 rounded-lg p-4 flex items-center justify-between"
                  >

                    <div>

                      <p className="text-white font-medium">
                        🚨 SOS #{sosClicks.length - index}
                      </p>

                      <p className="text-gray-400 text-sm">
                        {click.date} às {click.time}
                      </p>

                    </div>

                  </div>

              ))}

            </div>

          )}

        </div>

        {/* estado selecionado */}
        {selectedState && (

          <div className="mt-6 text-white rounded-xl bg-slate-800 p-6">

            <h2 className="text-xl">
              {selectedState.name}
            </h2>

            <p className="mt-2 text-gray-300">

              {calculatePercentage(
                selectedState.clicks,
                totalClicks
              )}% dos cliques

            </p>

          </div>

        )}

      </div>

    </div>
  );
}