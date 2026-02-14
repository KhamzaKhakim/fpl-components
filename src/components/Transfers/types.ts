export interface Player {
  id: number;
  name: string;
  team: string;
  // teamName: string;
  teamShortName: string;
  position: Position;
  gwPoints: number;
}

export type Position = "GK" | "DEF" | "MID" | "FWD";
