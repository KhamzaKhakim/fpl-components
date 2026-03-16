import { Value } from "@sinclair/typebox/value";
import { redis } from "bun";

import { PlayerSchema, PlayerType } from "./model";

let playersCache: Map<number, PlayerType> | null = null;

export async function getPlayerById(id: number) {
  const cachedPlayer = playersCache?.get(id);
  if (cachedPlayer) return cachedPlayer;

  const player = await redis.hget("players", id.toString());

  if (!player) throw new Error(`Player not found for id:${id}`);

  const fixedPlayer: PlayerType = JSON.parse(player);

  if (!Value.Check(PlayerSchema, fixedPlayer))
    throw new Error(`Invalid player for id:${id}`);

  return fixedPlayer;
}

export async function getAllPlayers() {
  if (playersCache) return playersCache;

  const players = await redis.hgetall("players");

  if (!players) throw new Error("Players not found");

  const fixedMap = new Map<number, PlayerType>();

  for (const [key, val] of Object.entries(players)) {
    fixedMap.set(+key, JSON.parse(val));
  }

  playersCache = fixedMap;

  return fixedMap;
}

export async function getAllPlayersArray() {
  if (playersCache) return [...playersCache.values()];

  const players = await redis.hgetall("players");

  if (!players) throw new Error("Players not found");

  const fixedMap = new Map<number, PlayerType>();

  for (const [key, val] of Object.entries(players)) {
    fixedMap.set(+key, JSON.parse(val));
  }

  playersCache = fixedMap;

  //not sure how use values
  return [...fixedMap.values()];
}

export function invalidatePlayersCache() {
  playersCache = null;
}
