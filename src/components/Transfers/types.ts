import { PickType } from "@/src/elysia/modules/transfers/model";

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

export type Squad = PickType[];
