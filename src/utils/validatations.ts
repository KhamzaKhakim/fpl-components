import { Player, Position } from "../components/Transfers";

export function isPlayer(obj: unknown): obj is Player {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as any).name === "string" &&
    typeof (obj as any).team === "string"
  );
}

const POSITIONS = ["GK", "DEF", "MID", "FWD", "SUB"] as const;

export function isPosition(obj: unknown): obj is Position {
  return typeof obj === "string" && POSITIONS.includes(obj as Position);
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
