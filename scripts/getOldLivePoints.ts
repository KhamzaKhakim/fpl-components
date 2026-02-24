import { EventType } from "@/src/elysia/modules/events/types";
import { LiveModel } from "@/src/elysia/modules/live/model";
import { getFixtureById } from "@/src/elysia/shared/store/fixturesStore";
import { getPlayerById } from "@/src/elysia/shared/store/playersStore";
import { getTeamById } from "@/src/elysia/shared/store/teamsStore";
import { redis } from "bun";

export type FplPlayerStat = {
  id: number;
  stats: {
    minutes: number;
    goals_scored: number;
    assists: number;
    clean_sheets: number;
    goals_conceded: number;
    own_goals: number;
    penalties_saved: number;
    penalties_missed: number;
    yellow_cards: number;
    red_cards: number;
    saves: number;
    bonus: number;
    bps: number;
    influence: string;
    creativity: string;
    threat: string;
    ict_index: string;
    clearances_blocks_interceptions: number;
    recoveries: number;
    tackles: number;
    defensive_contribution: number;
    starts: number;
    expected_goals: string;
    expected_assists: string;
    expected_goalInvolvements: string;
    expected_goals_conceded: string;
    total_points: number;
    in_dream_team: boolean;
  };
  explain: {
    fixture: number;
    stats: {
      identifier: string;
      points: number;
      value: number;
      points_modification: number;
    }[];
  }[];
  modified: boolean;
};

type LiveResponse = {
  elements: FplPlayerStat[];
};

async function fetchLivePoints() {
  try {
    //get current gameweek

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

      const fixedLivePoints = await Promise.all(
        liveElements.map(async (element) => {
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
            gwPoints: element.stats.total_points,
            minutes,
            fixtureIds,
            fixtures,
            fixturesFinished,
          } satisfies LiveModel.LiveType;
        }),
      ).then((v) => v.filter((p) => p != null));

      Bun.write(
        `./public/fpl/gameweek-points/gw-${events[i].id}.json`,
        JSON.stringify(fixedLivePoints),
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
