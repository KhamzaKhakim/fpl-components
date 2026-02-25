import { Value } from "@sinclair/typebox/value";
import { redis } from "bun";

import { LiveSchema, LiveType } from "./model";

export async function getLivePointByPlayerAndGameweek(
  gameweek: number,
  playerId: number,
): Promise<LiveType> {
  const livePoint = await redis.hget(`live:${gameweek}`, `${playerId}`);

  if (!livePoint) {
    throw new Error(
      `Live point not found for gameweek:${gameweek}, player:${playerId}`,
    );
  }

  const parsed: LiveType = JSON.parse(livePoint);

  if (!Value.Check(LiveSchema, parsed)) {
    throw new Error(
      `Invalid live point for gameweek:${gameweek}, player:${playerId}`,
    );
  }

  return parsed;
}

export async function getLivePointsByGameweek(
  gameweek: number,
): Promise<LiveType[]> {
  const livePointsHash = await redis.hgetall(`live:${gameweek}`);

  if (!livePointsHash || Object.keys(livePointsHash).length === 0) {
    throw new Error(`No live points found for gameweek:${gameweek}`);
  }

  const livePoints: LiveType[] = [];

  for (const value of Object.values(livePointsHash)) {
    const parsed: LiveType = JSON.parse(value as string);
    if (!Value.Check(LiveSchema, parsed)) {
      console.warn(`Invalid live point data`);
      continue;
    }

    livePoints.push(parsed);
  }

  return livePoints;
}
