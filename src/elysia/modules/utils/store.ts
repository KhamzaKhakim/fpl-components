import { PlayerType } from "../players/types";

export const playersById = new Map<number, PlayerType>();

const file = Bun.file("./public/players.json");
const players = (await file.json()) as PlayerType[];

for (const p of players) {
  playersById.set(p.id, p);
}
