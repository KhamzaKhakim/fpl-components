import { Value } from "@sinclair/typebox/value";
import { redis } from "bun";

import { LiveSchema, LiveType } from "./model";

export async function getLivePointByPlayerAndGameweek(
  gameweek: number,
  playerId: number,
): Promise<LiveType> {
  const key = `live:${gameweek}:${playerId}`;
  const livePoint = await redis.get(key);

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
  const pattern = `live:${gameweek}:*`;
  const keys = await redis.keys(pattern);

  if (!keys || keys.length === 0) {
    throw new Error(`No live points found for gameweek:${gameweek}`);
  }

  const livePoints: LiveType[] = [];

  for (const key of keys) {
    const value = await redis.get(key);
    if (!value) continue;

    const parsed: LiveType = JSON.parse(value);
    if (!Value.Check(LiveSchema, parsed)) {
      console.warn(`Invalid live point data for key:${key}`);
      continue;
    }

    livePoints.push(parsed);
  }

  return livePoints;
}

export async function setLivePointsForGameweek(
  gameweek: number,
  livePoints: LiveType[],
): Promise<void> {
  const keys: Record<string, string> = {};

  for (const livePoint of livePoints) {
    keys[`live:${gameweek}:${livePoint.id}`] = JSON.stringify(livePoint);
  }

  if (Object.keys(keys).length > 0) {
    await redis.hset(`live:${gameweek}`, keys);
  }
}
