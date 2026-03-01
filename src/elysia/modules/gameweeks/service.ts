import * as GameweekCache from "./cache";

export async function getGameweekById(id: number) {
  return GameweekCache.getGameweekById(id);
}

export async function getAllGameweeks() {
  return GameweekCache.getAllGameweeks();
}

export async function getCurrentGameweekId() {
  const currentGw = (await GameweekCache.getAllGameweeks()).find(
    (gw) => gw.isCurrent,
  );

  if (!currentGw) throw new Error(`Current gameweek not found`);

  return currentGw.id;
}

export async function getNextGameweekId() {
  const currentGw = (await GameweekCache.getAllGameweeks()).find(
    (gw) => gw.isNext,
  );

  if (!currentGw) throw new Error(`Current gameweek not found`);

  return currentGw.id;
}
