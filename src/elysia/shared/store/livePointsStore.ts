import camelcaseKeys from "camelcase-keys";
import { getCurrentGameweekId } from "../../modules/utils/gameweekUtils";
import { getFixtureById } from "./fixturesStore";
import { getTeamById } from "./teamsStore";
import { LiveModel } from "../../modules/live/model";
import { redis } from "bun";
import { getPlayerById } from "./playerStoreRedis";

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let isUpdating = false;

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

async function fetchLivePoints(): Promise<LiveModel.LiveType[]> {
  try {
    const gw = await getCurrentGameweekId();

    if (!gw) throw new Error("Current gameweek not found");

    const response = await fetch(
      `https://fantasy.premierleague.com/api/event/${gw}/live/`,
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    let liveResponse = await response.json();

    let liveElements = liveResponse.elements;

    const camelCaseliveElements = camelcaseKeys(liveElements, {
      deep: true,
    }) as FplPlayerStat[];

    const fixedLivePoints = await Promise.all(
      camelCaseliveElements.map(async (element) => {
        const player = await getPlayerById(element.id);
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
      }),
    ).then((v) => v.filter((v) => v != null));

    return fixedLivePoints;
  } catch (error) {
    console.error("Failed to fetch livePoints:", error);
    throw error;
  }
}

async function updateLivePoints(): Promise<void> {
  if (isUpdating) {
    console.log("Update already in progress, skipping");
    return;
  }

  isUpdating = true;

  try {
    const gw = await getCurrentGameweekId();

    if (!gw) throw new Error("Current gameweek not found");

    console.log("Updating livePoints...");
    const livePoints = await fetchLivePoints();
    redis.hset(
      `gw-${gw}`,
      Object.fromEntries(
        livePoints.map((p) => [p.id.toString(), JSON.stringify(p)]),
      ),
    );
    console.log("Finished gw: " + gw);
  } catch (error) {
    console.error("Failed to update livePoints:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

function startPeriodicUpdates(): void {
  // Update immediately on start
  updateLivePoints().catch(console.error);

  // Then set interval
  setInterval(() => {
    updateLivePoints().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic fixture updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

startPeriodicUpdates();

export async function getLivePoint({
  gw,
  player,
}: {
  gw: number;
  player: number;
}) {
  const livePointString = await redis.hget(`gw-${gw}`, player.toString());

  if (!livePointString)
    throw new Error(`Live point not found for gw: ${gw}, player: ${player}`);

  const livePoint = JSON.parse(livePointString) as LiveModel.LiveType;

  return livePoint;
}
