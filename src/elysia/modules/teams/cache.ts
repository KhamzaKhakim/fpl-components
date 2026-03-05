import { Value } from "@sinclair/typebox/value";
import { redis } from "bun";

import { TeamSchema, TeamType } from "./model";

let teamsCache: Map<number, TeamType> | null = null;

export async function getTeamById(id: number) {
  const cachedTeam = teamsCache?.get(id);
  if (cachedTeam) return cachedTeam;

  const team = await redis.hget("teams", id.toString());

  if (!team) throw new Error(`Team not found for id:${id}`);

  const fixedTeam: TeamType = JSON.parse(team);

  if (!Value.Check(TeamSchema, fixedTeam))
    throw new Error(`Invalid team for id:${id}`);

  return fixedTeam;
}

export async function getAllTeams() {
  if (teamsCache) return teamsCache;

  const teams = await redis.hgetall("teams");

  if (!teams) throw new Error("Teams not found");

  const fixedMap = new Map<number, TeamType>();

  for (const [key, val] of Object.entries(teams)) {
    fixedMap.set(+key, JSON.parse(val));
  }

  teamsCache = fixedMap;

  return fixedMap;
}

export function invalidateTeamsCache() {
  teamsCache = null;
}
