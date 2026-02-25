import * as GameweekCahce from "./cache";

export async function getGameweekById(id: number) {
  return GameweekCahce.getGameweekById(id);
}

export async function getAllGameweeks() {
  return GameweekCahce.getAllGameweeks();
}

export async function getCurrentGameweekId() {
  return GameweekCahce.getCurrentGameweekId();
}
