/* eslint-disable @typescript-eslint/no-explicit-any */
import { redis } from "bun";

import { getFixtureById } from "@/src/elysia/modules/fixtures/cache";
import { getAllGameweeks } from "@/src/elysia/modules/gameweeks/cache";
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

async function fetchLivePointsForGameweek(gw: number): Promise<LiveType[]> {
  try {
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
    console.error(`Failed to fetch live points for gameweek ${gw}:`, error);
    throw error;
  }
}

async function storeLivePointsForGameweek(
  gw: number,
  livePoints: LiveType[],
): Promise<void> {
  const record: Record<string, string> = livePoints.reduce(
    (acc, livePoint) => {
      acc[`${livePoint.id}`] = JSON.stringify(livePoint);
      return acc;
    },
    {} as Record<string, string>,
  );

  if (Object.keys(record).length > 0) {
    await redis.hset(`live:${gw}`, record);
    console.log(`Stored ${livePoints.length} live points for gameweek ${gw}`);
  }
}

async function getOldLivePoints(): Promise<void> {
  try {
    console.log("Fetching all gameweeks...");
    const allGameweeks = await getAllGameweeks();

    const finishedGameweeks = allGameweeks.filter((gw) => gw.finished);

    console.log(
      `Found ${finishedGameweeks.length} finished gameweeks, fetching live points...`,
    );

    for (const gw of finishedGameweeks) {
      try {
        // Check if live points already exist in cache
        const existingLivePoints = await redis.hgetall(`live:${gw.id}`);

        if (existingLivePoints && Object.keys(existingLivePoints).length > 0) {
          console.log(
            `Live points for gameweek ${gw.id} already cached, skipping`,
          );
          continue;
        }

        console.log(`Fetching live points for gameweek ${gw.id}...`);
        const livePoints = await fetchLivePointsForGameweek(gw.id);

        await storeLivePointsForGameweek(gw.id, livePoints);
      } catch (error) {
        console.error(
          `Failed to fetch live points for gameweek ${gw.id}:`,
          error,
        );
        // Continue with next gameweek on error
        continue;
      }
    }

    console.log("Finished fetching old live points");
  } catch (error) {
    console.error("Failed to get old live points:", error);
    throw error;
  }
}

await getOldLivePoints();
