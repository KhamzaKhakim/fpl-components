import { Player, Position } from "../components/Transfers/types";

//TODO: find better way for type checking
export function isPlayer(obj: unknown): obj is Player {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as any).name === "string" &&
    typeof (obj as any).teamShortName === "string"
  );
}

const POSITIONS = ["GK", "DEF", "MID", "FWD"] as const;

export function isPosition(obj: unknown): obj is Position {
  return typeof obj === "string" && POSITIONS.includes(obj as Position);
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
