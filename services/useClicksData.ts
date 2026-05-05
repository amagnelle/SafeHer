import { useMemo } from "react";
import {
  brazilStatesData,
  getTotalClicks,
  calculatePercentage,
  StateData,
} from "@/lib/brazilGeoData";

export function useClicksData() {
  const totalClicks = useMemo(
    () => getTotalClicks(brazilStatesData),
    []
  );

  const getStateClicks = (code: string) =>
    brazilStatesData.find((s) => s.code === code)?.clicks || 0;

  const getStatePercentage = (code: string) =>
    calculatePercentage(getStateClicks(code), totalClicks);

  const getTopStates = (limit = 5): StateData[] =>
    [...brazilStatesData]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);

  return {
    totalClicks,
    getStateClicks,
    getStatePercentage,
    getTopStates,
    brazilStatesData,
  };
}