import { Value } from "@sinclair/typebox/value";
import { redis } from "bun";

import { FixtureSchema, FixtureType } from "./model";

export async function getFixtureById(id: number) {
  const fixture = await redis.hget("fixtures", `fixture:${id}`);

  if (!fixture) throw new Error(`Fixture not found for id:${id}`);

  const fixedFixture: FixtureType = JSON.parse(fixture);

  if (!Value.Check(FixtureSchema, fixedFixture))
    throw new Error(`Invalid fixture for id:${id}`);

  return fixedFixture;
}

export async function getAllFixtures() {
  const fixtures = await redis.hgetall("fixtures");

  if (!fixtures || Object.keys(fixtures).length === 0) {
    throw new Error("No fixtures found");
  }

  return Object.values(fixtures).map((fixture) => {
    const parsed: FixtureType = JSON.parse(fixture as string);
    if (!Value.Check(FixtureSchema, parsed)) {
      throw new Error(`Invalid fixture data`);
    }
    return parsed;
  });
}
