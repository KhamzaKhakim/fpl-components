/* eslint-disable @typescript-eslint/no-explicit-any */
import { redis } from "bun";

import { GameweekType } from "@/src/elysia/modules/gameweeks/model";

const UPDATE_INTERVAL_MS = 60 * 1000;

function mapGameweeks(t: any): GameweekType {
  return {
    id: t.id,
    name: t.name,
    deadlineTime: t.deadline_time,
    deadlineTimeEpoch: t.deadline_time_epoch,
    isCurrent: t.is_current,
    highestScore: t.highest_score,
  };
}

async function fetchGameweeks(): Promise<GameweekType[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const gameweeks: any[] = json?.["gameweeks"];

    return gameweeks.map(mapGameweeks);
  } catch (error) {
    console.error("Failed to fetch gameweeks:", error);
    throw error;
  }
}

export async function updateGameweeks(): Promise<void> {
  try {
    console.log("Updating gameweeks...");
    const gameweeks = await fetchGameweeks();

    const record: Record<string, string> = gameweeks.reduce(
      (acc, gw) => {
        acc[`gw:${gw.id}`] = JSON.stringify(gw);
        return acc;
      },
      {} as Record<string, string>,
    );

    redis.hset("gameweeks", record);

    console.log(
      `gameweeks updated successfully at ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error("Failed to update gameweeks:", error);
  }
}

function startPeriodicGameweekUpdates(): void {
  updateGameweeks().catch(console.error);
  setInterval(() => {
    updateGameweeks().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic gameweek updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

startPeriodicGameweekUpdates();
