import { LiveType } from "../../live/types";
import { FixtureType } from "../fixtures/types";
import { PlayerType } from "../players/types";
import { TeamType } from "../teams/types";

export const playersById = new Map<number, PlayerType>();

const playersFile = Bun.file("./public/players.json");
const players = (await playersFile.json()) as PlayerType[];

for (const p of players) {
  playersById.set(p.id, p);
}

export const teamsById = new Map<number, TeamType>();

const teamsFile = Bun.file("./public/teams.json");
const teams = (await teamsFile.json()) as TeamType[];

for (const t of teams) {
  teamsById.set(t.id, t);
}

export const fixturesById = new Map<number, FixtureType>();

const fixturesFile = Bun.file("./public/fixtures.json");
const fixtures = await fixturesFile.json();

for (const t of fixtures) {
  fixturesById.set(t.id, t);
}

export const livePointsById = new Map<number, LiveType>();

const livePointsFile = Bun.file("./public/live-points.json");
const livePoints = await livePointsFile.json();

for (const t of livePoints) {
  livePointsById.set(t.id, t);
}
