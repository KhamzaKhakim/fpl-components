import * as GameweekCache from "./cache";

export async function getGameweekById(id: number) {
  return GameweekCache.getGameweekById(id);
}

export async function getAllGameweeks() {
  return GameweekCache.getAllGameweeks();
}

export async function getCurrentGameweekId() {
  return GameweekCache.getCurrentGameweekId();
}
