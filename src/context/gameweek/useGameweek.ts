import { useContext } from "react";
import { GameweekContext, GwContextType } from "./GameweekProvider";

export function useGameweek(): GwContextType {
  const context = useContext(GameweekContext);
  if (!context) {
    throw new Error("useGameweek must be used within a GameweekProvider");
  }
  return context;
}
