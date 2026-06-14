import { useState } from "react";
import {
  StateData,
  calculatePercentage,
  getTotalClicks,
} from "@/lib/brazilGeoData";

interface BrazilMapPurpleProps {
  states: StateData[];
  onStateClick?: (state: StateData) => void;
}

// Coordenadas dos estados (baseadas no mapa)
const stateCoordinates: Record<string, { x: number; y: number; r: number }> = {
  RR: { x: 25, y: 10, r: 5 },
  AP: { x: 35, y: 8, r: 4 },
  AM: { x: 20, y: 20, r: 7 },
  PA: { x: 35, y: 25, r: 8 },
  RO: { x: 18, y: 35, r: 4 },
  AC: { x: 12, y: 40, r: 4 },
  TO: { x: 38, y: 40, r: 5 },
  MA: { x: 45, y: 30, r: 5 },
  CE: { x: 55, y: 28, r: 5 },
  RN: { x: 58, y: 24, r: 4 },
  PB: { x: 60, y: 28, r: 4 },
  PE: { x: 62, y: 32, r: 4 },
  AL: { x: 64, y: 34, r: 3 },
  SE: { x: 66, y: 36, r: 3 },
  BA: { x: 58, y: 45, r: 9 },
  PI: { x: 50, y: 36, r: 5 },
  GO: { x: 48, y: 50, r: 5 },
  DF: { x: 50, y: 52, r: 3 },
  MG: { x: 56, y: 56, r: 8 },
  ES: { x: 64, y: 54, r: 4 },
  RJ: { x: 62, y: 62, r: 5 },
  SP: { x: 54, y: 64, r: 8 },
  PR: { x: 52, y: 72, r: 6 },
  SC: { x: 52, y: 80, r: 5 },
  RS: { x: 50, y: 88, r: 6 },
  MS: { x: 46, y: 70, r: 5 },
  MT: { x: 40, y: 54, r: 6 },
};

export function BrazilMapPurple({
  states,
  onStateClick,
}: BrazilMapPurpleProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const totalClicks = getTotalClicks(states);

  const getStateData = (code: string) =>
    states.find((s) => s.code === code);

  const getColor = (code: string) => {
    const state = getStateData(code);
    if (!state) return "rgba(139, 92, 246, 0.2)";

    const percentage = calculatePercentage(state.clicks, totalClicks);
    const intensity = Math.min(percentage / 5, 1);

    return `rgba(139, 92, 246, ${0.4 + intensity * 0.6})`;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* IMAGEM BASE - precisa estar em /public */}
      <img
        src="/brasil-map.png"
        alt="Mapa do Brasil"
        className="w-full h-full object-contain rounded-lg"
      />

      {/* SVG INTERATIVO */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {Object.entries(stateCoordinates).map(([code, coords]) => {
          const state = getStateData(code);
          const clicks = state?.clicks || 0;
          const percentage = calculatePercentage(clicks, totalClicks);
          const isHovered = hoveredState === code;

          return (
            <g key={code}>
              {/* Glow quando passa o mouse */}
              {isHovered && (
                <>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={coords.r + 2}
                    fill="rgba(139, 92, 246, 0.3)"
                  />
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={coords.r + 1}
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="0.5"
                  />
                </>
              )}

              {/* Círculo clicável */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={coords.r}
                fill={getColor(code)}
                stroke="#60A5FA"
                strokeWidth="0.4"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredState(code)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => {
                  const stateData = getStateData(code);
                  if (stateData && onStateClick) {
                    onStateClick(stateData);
                  }
                }}
              />

              {/* Código do estado */}
              <text
                x={coords.x}
                y={coords.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#FFFFFF"
                fontSize="1.4"
                fontWeight="bold"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {code}
              </text>

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={coords.x - 10}
                    y={coords.y - 8}
                    width="20"
                    height="6"
                    fill="#1F2937"
                    rx="0.8"
                    stroke="#60A5FA"
                    strokeWidth="0.2"
                  />
                  <text
                    x={coords.x}
                    y={coords.y - 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#FBBF24"
                    fontSize="0.9"
                    fontWeight="bold"
                  >
                    {clicks} ({percentage}%)
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}