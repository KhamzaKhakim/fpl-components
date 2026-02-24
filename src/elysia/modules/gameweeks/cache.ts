import { redis } from "bun";
import { GameweekSchema, GameweekType } from "./model";
import { Value } from "@sinclair/typebox/value";

export async function getGameweekById(id: number) {
  const gameweek = await redis.hget("gameweeks", `gw:${id}`);

  if (!gameweek) throw new Error(`Gameweek not found for gw:${id}`);

  const fixedGw: GameweekType = JSON.parse(gameweek);

  if (!Value.Check(GameweekSchema, fixedGw))
    throw new Error(`Invalid gameweek for gw:${id}`);

  return fixedGw;
}

export async function getAllGameweeks() {
  const gameweeks = await redis.hgetall("gameweeks");

  if (!gameweeks) throw new Error("Gameweeks not found");

  const fixedGameweeks = Object.entries(gameweeks).map(
    ([_, val]) => JSON.parse(val) as GameweekType,
  );

  if (!fixedGameweeks.length) throw new Error("Gameweeks are empty");

  fixedGameweeks.forEach((gw) => {
    if (!Value.Check(GameweekSchema, gw)) {
      console.log([...Value.Errors(GameweekSchema, gw)]);
      throw new Error(`Invalid gameweek`);
    }
  });

  return fixedGameweeks;
}

export async function getCurrentGameweekId() {
  const currentGw = (await getAllGameweeks()).find((gw) => gw.isCurrent);

  if (!currentGw) throw new Error(`Current gameweek not found`);

  return currentGw.id;
}
