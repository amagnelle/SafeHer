export interface StateData {
  code: string;
  name: string;
  clicks: number;
}

export const brazilStatesData: StateData[] = [
  { code: "RJ", name: "Rio de Janeiro", clicks: 120 },
  { code: "SP", name: "São Paulo", clicks: 95 },
  { code: "MG", name: "Minas Gerais", clicks: 70 },
  { code: "BA", name: "Bahia", clicks: 50 },
  { code: "PR", name: "Paraná", clicks: 42 },
  { code: "RS", name: "Rio Grande do Sul", clicks: 38 },
  { code: "PE", name: "Pernambuco", clicks: 32 },
];

export function calculatePercentage(clicks: number, total: number): number {
  if (total === 0) return 0;
  return Number(((clicks / total) * 100).toFixed(1));
}

export function getTotalClicks(states: StateData[]): number {
  return states.reduce((sum, state) => sum + state.clicks, 0);
}

export function getTopStates(states: StateData[], limit = 5): StateData[] {
  return [...states].sort((a, b) => b.clicks - a.clicks).slice(0, limit);
}