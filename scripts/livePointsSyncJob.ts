/* eslint-disable @typescript-eslint/no-explicit-any */
import { redis } from "bun";

import { getFixtureById } from "@/src/elysia/modules/fixtures/cache";
import { getCurrentGameweekId } from "@/src/elysia/modules/gameweeks/cache";
import { LiveType } from "@/src/elysia/modules/live/model";
import { getPlayerById } from "@/src/elysia/modules/players/cache";
import { getTeamById } from "@/src/elysia/modules/teams/cache";

async function enrichLivePoint(element: any): Promise<LiveType | null> {
  try {
    const player = await getPlayerById(element.id);
    if (!player) {
      console.warn(`Player not found for id: ${element.id}`);
      return null;
    }

    const team = await getTeamById(player.team);
    if (!team) {
      console.warn(`Team not found for id: ${player.team}`);
      return null;
    }

    const fixtureIds: number[] = [];
    const fixtures: string[] = [];
    const fixturesFinished: boolean[] = [];
    const minutes: number[] = [];

    for (const explain of element.explain || []) {
      try {
        const fixture = await getFixtureById(explain.fixture);
        if (!fixture) continue;

        fixtureIds.push(fixture.id);
        fixturesFinished.push(fixture.finished);
        minutes.push(fixture.minutes);

        const isHome = fixture.teamH === team.id;
        const opponentId = isHome ? fixture.teamA : fixture.teamH;
        const opponent = await getTeamById(opponentId);

        fixtures.push(`${opponent?.shortName ?? "UNK"}(${isHome ? "H" : "A"})`);
      } catch (error) {
        console.warn(
          `Error processing fixture for player ${element.id}:`,
          error,
        );
        continue;
      }
    }

    return {
      id: element.id,
      gwPoints: element.stats?.total_points ?? 0,
      minutes,
      fixtureIds,
      fixtures,
      fixturesFinished,
    } satisfies LiveType;
  } catch (error) {
    console.warn(`Error enriching live point for player ${element.id}:`, error);
    return null;
  }
}

const UPDATE_INTERVAL_MS = 60 * 1000; // 1 minute

async function fetchLivePoints(): Promise<LiveType[]> {
  try {
    const gw = await getCurrentGameweekId();

    if (!gw) {
      throw new Error("Current gameweek not found");
    }

    const response = await fetch(
      `https://fantasy.premierleague.com/api/event/${gw}/live/`,
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const liveResponse = await response.json();
    const liveElements: any[] = liveResponse.elements || [];

    const enrichedPoints: LiveType[] = [];

    for (const element of liveElements) {
      const enriched = await enrichLivePoint(element);
      if (enriched) {
        enrichedPoints.push(enriched);
      }
    }

    return enrichedPoints;
  } catch (error) {
    console.error("Failed to fetch live points:", error);
    throw error;
  }
}

async function updateLivePoints(): Promise<void> {
  try {
    const gw = await getCurrentGameweekId();

    if (!gw) {
      throw new Error("Current gameweek not found");
    }

    console.log(`Updating live points for gameweek: ${gw}`);
    const livePoints = await fetchLivePoints();

    const record: Record<string, string> = livePoints.reduce(
      (acc, livePoint) => {
        acc[`${livePoint.id}`] = JSON.stringify(livePoint);
        return acc;
      },
      {} as Record<string, string>,
    );

    await redis.hset(`live:${gw}`, record);

    console.log(
      `Finished updating live points for gameweek ${gw}. Total points: ${livePoints.length}`,
    );
  } catch (error) {
    console.error("Failed to update live points:", error);
  }
}

function startPeriodicLivePointsUpdates(): void {
  updateLivePoints().catch(console.error);
  setInterval(() => {
    updateLivePoints().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic live points updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

startPeriodicLivePointsUpdates();
