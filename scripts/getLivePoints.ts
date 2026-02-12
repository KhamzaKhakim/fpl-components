import { getCurrentGameweekId } from "@/src/elysia/modules/utils/gameweekUtils";
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

  fixturesJson = fixturesJson.elements;

  const camelCaseFixturesJson = camelcaseKeys(fixturesJson, { deep: true });

  Bun.write("./public/fixtures.json", JSON.stringify(camelCaseFixturesJson));

  //   const fixedLivePoints = [];
  //   for (const element of camelCaseLiveJson) {
  //     fixedLivePoints.push({
  //       id: element.id,
  //       totalPoints: element.stats.totalPoints,
  //       finished: true, //bool
  //       fixtureIds: element.explain.map((v: any) => v.fixture),
  //       fixtures,
  //       //   fixturePoints: element.explain.map((v: any) => stats)
  //     });
  //   }
}

console.log("Started live points");
await getLivePoints();
console.log("Finished live points");
