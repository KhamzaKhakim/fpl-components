import { PlayerType } from "@/src/elysia/modules/players/types";

export {};

type Player = {
  id: number;
  web_name: string;
  team: number;
  team_code: number;
  selected_by_percent: number;
  event_points: number;
  total_points: number;
  now_cost: number;
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
        gwPoints: p.event_points,
        totalPoints: p.total_points,
        price: p.now_cost,
      }) as PlayerType,
  );

  Bun.write("./public/players.json", JSON.stringify(playersMapped));
  Bun.write(
    "./public/players-full.json",
    JSON.stringify(json?.elements.slice(0, 5)),
  );
}

console.log("Started players");
await getPlayers();
console.log("Finished players");
