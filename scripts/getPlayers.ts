import { PlayerType } from "@/src/elysia/modules/players/types";

export {};

type Player = {
  id: number;
  web_name: string;
  team: number;
  team_code: number;
  selected_by_percent: number;
};

async function getPlayers() {
  const response = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
  );

  const json = await response.json();
  const players: Player[] = json?.["elements"];

  const playersMapped = players.map(
    (p) =>
      ({
        id: p.id,
        name: p.web_name,
        team: p.team,
        teamCode: p.team_code,
        selectedByPercent: p.selected_by_percent,
      }) as PlayerType,
  );

  Bun.write("./public/players.json", JSON.stringify(playersMapped));
}

console.log("Started players");
await getPlayers();
console.log("Finished players");
