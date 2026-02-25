import { Value } from "@sinclair/typebox/value";
import { redis } from "bun";

import { PlayerSchema, PlayerType } from "./model";

export async function getPlayerById(id: number) {
  const player = await redis.get(`player:${id}`);

  if (!player) throw new Error(`Player not found for gw:${id}`);

  const fixedPlayer: PlayerType = JSON.parse(player);

  if (!Value.Check(PlayerSchema, fixedPlayer))
    throw new Error(`Invalid player for gw:${id}`);

  return fixedPlayer;
}
