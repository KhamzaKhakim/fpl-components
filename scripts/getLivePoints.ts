import { getCurrentGameweekId } from "@/src/elysia/modules/utils/gameweekUtils";
import {
  fixturesById,
  playersById,
  teamsById,
} from "@/src/elysia/modules/utils/store";
import camelcaseKeys from "camelcase-keys";

export {};

export type FplPlayerStat = {
  id: number;
  stats: {
    minutes: number;
    goalsScored: number;
    assists: number;
    cleanSheets: number;
    goalsConceded: number;
    ownGoals: number;
    penaltiesSaved: number;
    penaltiesMissed: number;
    yellowCards: number;
    redCards: number;
    saves: number;
    bonus: number;
    bps: number;
    influence: string;
    creativity: string;
    threat: string;
    ictIndex: string;
    clearancesBlocksInterceptions: number;
    recoveries: number;
    tackles: number;
    defensiveContribution: number;
    starts: number;
    expectedGoals: string;
    expectedAssists: string;
    expectedGoalInvolvements: string;
    expectedGoalsConceded: string;
    totalPoints: number;
    inDreamTeam: boolean;
  };
  explain: {
    fixture: number;
    stats: {
      identifier: string;
      points: number;
      value: number;
      pointsModification: number;
    }[];
  }[];
  modified: boolean;
};

type LiveResponse = {
  elements: FplPlayerStat[];
};

async function getLivePoints() {
  const gw = await getCurrentGameweekId();

  if (!gw) return;

  const live = await fetch(
    `https://fantasy.premierleague.com/api/event/${gw}/live/`,
  );

  let liveResponse = (await live.json()) as LiveResponse;

  let liveElements = liveResponse.elements;

  const camelCaseliveElements = camelcaseKeys(liveElements, { deep: true });

  Bun.write("./public/live.json", JSON.stringify(camelCaseliveElements));

  //TODO: improve this part
  const fixedLivePoints = camelCaseliveElements
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

  Bun.write("./public/live-points.json", JSON.stringify(fixedLivePoints));
}

console.log("Started live points");
await getLivePoints();
console.log("Finished live points");
