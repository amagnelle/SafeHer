// Tipagem dos dados de cada estado
export interface StateData {
  name: string;
  code: string;
  clicks: number;
  latitude: number;
  longitude: number;
}

// Dados mockados dos estados
export const brazilStatesData: StateData[] = [
  { name: "São Paulo", code: "SP", clicks: 400, latitude: -23.5505, longitude: -46.6333 },
  { name: "Minas Gerais", code: "MG", clicks: 225, latitude: -19.9167, longitude: -43.9345 },
  { name: "Rio de Janeiro", code: "RJ", clicks: 150, latitude: -22.9068, longitude: -43.1729 },
  { name: "Bahia", code: "BA", clicks: 100, latitude: -12.9822, longitude: -38.5104 },
  { name: "Paraná", code: "PR", clicks: 75, latitude: -25.4195, longitude: -49.2646 },
  { name: "Santa Catarina", code: "SC", clicks: 65, latitude: -27.5969, longitude: -48.5494 },
  { name: "Rio Grande do Sul", code: "RS", clicks: 55, latitude: -30.0346, longitude: -51.2177 },
  { name: "Pernambuco", code: "PE", clicks: 45, latitude: -8.2880, longitude: -35.0726 },
  { name: "Ceará", code: "CE", clicks: 40, latitude: -3.7319, longitude: -38.5267 },
  { name: "Pará", code: "PA", clicks: 35, latitude: -1.4554, longitude: -48.5038 },
  { name: "Goiás", code: "GO", clicks: 30, latitude: -15.7942, longitude: -48.6694 },
  { name: "Distrito Federal", code: "DF", clicks: 28, latitude: -15.7975, longitude: -47.8919 },
  { name: "Espírito Santo", code: "ES", clicks: 25, latitude: -20.3155, longitude: -40.3128 },
  { name: "Maranhão", code: "MA", clicks: 20, latitude: -2.5551, longitude: -44.3055 },
  { name: "Paraíba", code: "PB", clicks: 18, latitude: -7.1195, longitude: -34.8450 },
  { name: "Rio Grande do Norte", code: "RN", clicks: 16, latitude: -5.7975, longitude: -35.2094 },
  { name: "Alagoas", code: "AL", clicks: 14, latitude: -9.6662, longitude: -35.7353 },
  { name: "Sergipe", code: "SE", clicks: 12, latitude: -10.5741, longitude: -37.0711 },
  { name: "Mato Grosso do Sul", code: "MS", clicks: 11, latitude: -20.7722, longitude: -55.7944 },
  { name: "Mato Grosso", code: "MT", clicks: 10, latitude: -15.5, longitude: -56.0 },
  { name: "Amazonas", code: "AM", clicks: 8, latitude: -3.1190, longitude: -60.0217 },
  { name: "Rondônia", code: "RO", clicks: 6, latitude: -11.7855, longitude: -63.9021 },
  { name: "Acre", code: "AC", clicks: 5, latitude: -9.9781, longitude: -67.8149 },
  { name: "Amapá", code: "AP", clicks: 4, latitude: 1.4136, longitude: -51.1857 },
  { name: "Roraima", code: "RR", clicks: 3, latitude: 2.8235, longitude: -60.6758 },
  { name: "Tocantins", code: "TO", clicks: 2, latitude: -10.1753, longitude: -48.2982 },
];


// =========================
// UTILITÁRIOS
// =========================

// Soma total de cliques
export function getTotalClicks(states: StateData[]): number {
  if (!states || states.length === 0) return 0;

  return states.reduce((sum, state) => {
    const clicks = Number(state.clicks) || 0;
    return sum + clicks;
  }, 0);
}


// Calcula porcentagem
export function calculatePercentage(clicks: number, total: number): number {
  if (!total || total <= 0) return 0;

  return Math.round((clicks / total) * 100);
}


// Retorna top estados
export function getTopStates(
  states: StateData[],
  limit: number = 5
): StateData[] {
  if (!states || states.length === 0) return [];

  return [...states]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, limit);
}


// Buscar estado por código
export function getStateByCode(
  states: StateData[],
  code: string
): StateData | undefined {
  return states.find((state) => state.code === code);
}