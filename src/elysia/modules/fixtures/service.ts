import * as FixtureCache from "./cache";

export function getFixtureById(id: number) {
  return FixtureCache.getFixtureById(id);
}

export function getAllFixtures() {
  return FixtureCache.getAllFixtures();
}
