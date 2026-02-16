import { EventType } from "@/src/elysia/modules/events/types";
import { LiveModel } from "@/src/elysia/modules/live/model";
import { getFixtureById } from "@/src/elysia/shared/store/fixturesStore";
import { getPlayerById } from "@/src/elysia/shared/store/playersStore";
import { getTeamById } from "@/src/elysia/shared/store/teamsStore";
import { redis } from "bun";
import camelcaseKeys from "camelcase-keys";

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

async function fetchLivePoints() {
  try {
    const eventsFile = Bun.file("./public/events.json");
    const events = (await eventsFile.json()) as EventType[];

    if (!events) throw new Error("Gameweeks not found");

    for (let i = 0; i < events.length; i++) {
      if (events[i].finished == true || events[i].isCurrent == true) return;

      const response = await fetch(
        `https://fantasy.premierleague.com/api/event/${events[i].id}/live/`,
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      let liveResponse = (await response.json()) as LiveResponse;

      let liveElements = liveResponse.elements;

      const camelCaseliveElements = camelcaseKeys(liveElements, { deep: true });

      const fixedLivePoints = camelCaseliveElements
        .map((element) => {
          const player = getPlayerById(element.id);
          if (!player) return null;

          const team = getTeamById(player.team);
          if (!team) return null;

          const fixtureIds: number[] = [];
          const fixtures: string[] = [];
          const fixturesFinished: boolean[] = [];
          const minutes: number[] = [];

          for (const explain of element.explain) {
            const fixture = getFixtureById(explain.fixture);
            if (!fixture) continue;

            fixtureIds.push(fixture.id);
            fixturesFinished.push(fixture.finished);
            minutes.push(fixture.minutes);

            const isHome = fixture.teamH === team.id;
            const opponentId = isHome ? fixture.teamA : fixture.teamH;
            const opponent = getTeamById(opponentId);

            fixtures.push(
              `${opponent?.shortName ?? "UNK"}(${isHome ? "H" : "A"})`,
            );
          }

          return {
            id: element.id,
            gwPoints: element.stats.totalPoints,
            minutes,
            fixtureIds,
            fixtures,
            fixturesFinished,
          } satisfies LiveModel.LiveType;
        })
        .filter((p) => p != null);

      redis.hset(
        `gw-${events[i].id}`,
        Object.fromEntries(
          fixedLivePoints.map((p) => [p.id.toString(), JSON.stringify(p)]),
        ),
      );
      console.log("Finished gw: " + events[i].id);
    }
  } catch (error) {
    console.error("Failed to fetch livePoints:", error);
    throw error;
  }
}

console.log("Started live points");
await fetchLivePoints();
console.log("Finished live points");
