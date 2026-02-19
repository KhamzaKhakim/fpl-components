import { TeamsModel } from "@/src/elysia/modules/teams/model";

export interface Player {
  id: number;
  name: string;
  team: number;
  // teamName: string;
  teamShortName: string;
  position: Position;
  gwPoints: number;
}

export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Squad = TeamsModel.PickType[];
