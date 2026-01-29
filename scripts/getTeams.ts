import { TeamType } from "@/src/elysia/modules/teams/types";

export {};

type Team = {
  code: number;
  draw: number;
  form: string | null;
  id: number;
  loss: number;
  name: string;
  played: number;
  points: number;
  position: number;
  short_name: string;
  strength: number;
  team_division: number | null;
  unavailable: boolean;
  win: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
  pulse_id: number;
};

async function getTeams() {
  const response = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/",
  );

  const json = await response.json();
  const teams: Team[] = json?.["teams"];

  console.log(teams);

  const teamsMapped = teams.map(
    (t) =>
      ({
        id: t.id,
        code: t.code,
        name: t.name,
        shortName: t.short_name,
        strengthOverallHome: t.strength_overall_home,
        strengtHoverallAway: t.strength_overall_away,
        strengthAttackHome: t.strength_attack_home,
        strengthAttackAway: t.strength_attack_away,
        strengthDefenceHome: t.strength_defence_home,
        strengthDefenceAway: t.strength_defence_away,
      }) as TeamType,
  );

  Bun.write("./public/teams.json", JSON.stringify(teamsMapped));
}

console.log("Started teams");
await getTeams();
console.log("Finished teams");
