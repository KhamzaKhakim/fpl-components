export interface Player {
  name: string;
  price: string;
  team: string;
  teamShortName: string;
  position: Position;
  gwPoints: number;
}

export type Position = "GK" | "DEF" | "MID" | "FWD";
