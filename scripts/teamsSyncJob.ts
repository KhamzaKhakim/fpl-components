/* eslint-disable @typescript-eslint/no-explicit-any */
import { redis } from "bun";

import { TeamType } from "@/src/elysia/modules/teams/model";

function mapTeam(t: any): TeamType {
  return {
    id: t.id,
    code: t.code,
    name: t.name,
    shortName: t.short_name,
    strength: t.strength,
    position: t.position,
  };
}

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

async function fetchTeams(): Promise<TeamType[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const teams: any[] = json?.["teams"];

    return teams.map(mapTeam);
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    throw error;
  }
}

async function updateTeams(): Promise<void> {
  try {
    console.log("Updating teams...");
    const teams = await fetchTeams();

    const record: Record<string, string> = teams.reduce(
      (acc, team) => {
        acc[`team:${team.id}`] = JSON.stringify(team);
        return acc;
      },
      {} as Record<string, string>,
    );

    redis.hset("teams", record);

    console.log("Finished updating teams");
  } catch (error) {
    console.error("Failed to update teams:", error);
  }
}

function startPeriodicTeamUpdates(): void {
  updateTeams().catch(console.error);
  setInterval(() => {
    updateTeams().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic team updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

startPeriodicTeamUpdates();
