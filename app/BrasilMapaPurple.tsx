import {
  StateData,
  calculatePercentage,
  getTotalClicks,
} from "@/lib/brazilGeoData";
import { Text, View } from "react-native";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";

interface Props {
  states: StateData[];
  onStateClick?: (state: StateData) => void;
}

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

export function BrazilMapPurple({ states, onStateClick }: Props) {
  const totalClicks = getTotalClicks(states);

  const getStateData = (code: string) => {
    return states.find((state) => state.code === code);
  };

  const getOpacity = (clicks: number) => {
    const percentage = calculatePercentage(clicks, totalClicks);
    return Math.min(0.35 + percentage / 100, 1);
  };

  return (
    <View
      style={{
        backgroundColor: "#1e1b4b",
        borderRadius: 18,
        padding: 12,
        height: 430,
        width: "100%",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Mapa de Cliques por Estado
      </Text>

      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        <Rect x="0" y="0" width="100" height="100" rx="4" fill="#0f172a" />

        {Object.entries(stateCoordinates).map(([code, coords]) => {
          const state = getStateData(code);
          const clicks = state?.clicks ?? 0;
          const opacity = getOpacity(clicks);

          return (
            <Svg key={code}>
              <Circle
                cx={coords.x}
                cy={coords.y}
                r={coords.r}
                fill="#8b5cf6"
                opacity={opacity}
                stroke="#60a5fa"
                strokeWidth="0.5"
                onPress={() => {
                  if (state) onStateClick?.(state);
                }}
              />

              <SvgText
                x={coords.x}
                y={coords.y + 0.6}
                fill="#ffffff"
                fontSize="2.2"
                fontWeight="bold"
                textAnchor="middle"
              >
                {code}
              </SvgText>
            </Svg>
          );
        })}
      </Svg>
    </View>
  );
}
