import { getCurrentGameweekId } from "@/src/elysia/modules/utils/gameweekUtils";
import {
  fixturesById,
  playersById,
  teamsById,
} from "@/src/elysia/modules/utils/store";
import camelcaseKeys from "camelcase-keys";

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

async function getLivePoints() {
  const gw = await getCurrentGameweekId();

  if (!gw) return;

  const live = await fetch(
    `https://fantasy.premierleague.com/api/event/${gw}/live/`,
  );

  let liveJson = await live.json();

  liveJson = liveJson.elements;

  const camelCaseLiveJson = camelcaseKeys(liveJson, { deep: true });

  Bun.write("./public/live.json", JSON.stringify(camelCaseLiveJson));

  const fixtures = await fetch(
    `https://fantasy.premierleague.com/api/fixtures/`,
  );

  let fixturesJson = await fixtures.json();

  const camelCaseFixturesJson = camelcaseKeys(fixturesJson, { deep: true });

  Bun.write("./public/fixtures.json", JSON.stringify(camelCaseFixturesJson));

  //TODO: improve this part
  const fixedLivePoints = camelCaseLiveJson
    .map((element) => {
      const player = playersById.get(element.id);
      if (!player) return null;

      const team = teamsById.get(player.team);
      if (!team) return null;

      const fixtureIds: number[] = [];
      const fixtures: string[] = [];
      const fixturesFinished: boolean[] = [];

      for (const explain of element.explain) {
        const fixture = fixturesById.get(explain.fixture);
        if (!fixture) continue;

        fixtureIds.push(fixture.id);
        fixturesFinished.push(fixture.finished);

        const isHome = fixture.teamH === team.id;
        const opponentId = isHome ? fixture.teamA : fixture.teamH;
        const opponent = teamsById.get(opponentId);

        fixtures.push(`${opponent?.shortName ?? "UNK"}(${isHome ? "H" : "A"})`);
      }

      return {
        id: element.id,
        totalPoints: element.stats.totalPoints,
        fixtureIds,
        fixtures,
        fixturesFinished,
      };
    })
    .filter(Boolean);

  Bun.write("./public/fixtures-final.json", JSON.stringify(fixedLivePoints));
}

console.log("Started live points");
await getLivePoints();
console.log("Finished live points");
