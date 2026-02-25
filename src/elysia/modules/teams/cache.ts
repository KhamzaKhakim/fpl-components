import { Value } from "@sinclair/typebox/value";
import { redis } from "bun";

import { TeamSchema, TeamType } from "./model";

export async function getTeamById(id: number) {
  const team = await redis.hget("teams", `team:${id}`);

  if (!team) throw new Error(`Team not found for id:${id}`);

  const fixedTeam: TeamType = JSON.parse(team);

  if (!Value.Check(TeamSchema, fixedTeam))
    throw new Error(`Invalid team for id:${id}`);

  return fixedTeam;
}
