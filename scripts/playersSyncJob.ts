/* eslint-disable @typescript-eslint/no-explicit-any */
import { redis } from "bun";

import { PlayerType } from "@/src/elysia/modules/players/model";
import { getAllTeams } from "@/src/elysia/modules/teams/cache";
import { positionById } from "@/src/utils/mapApi";

function mapPlayer(
  p: any,
  teamsMap: Awaited<ReturnType<typeof getAllTeams>>,
): PlayerType {
  return {
    id: p.id,
    webName: p.web_name,
    team: p.team,
    teamShortName: teamsMap.get(p.team)?.shortName!,
    selectedByPercent: p.selected_by_percent,
    totalPoints: p.total_points,
    nowCost: p.now_cost,
    costChangeStart: p.cost_change_start,
    elementType: p.element_type,
    position: positionById[p.element_type],
    canSelect: p.can_select,
    epNext: p.ep_next,
    epThis: p.ep_this,
    chanceOfPlayingNextRound: p.chance_of_playing_next_round ?? null,
    chanceOfPlayingThisRound: p.chance_of_playing_this_round ?? null,
    form: p.form,
    transfersIn: p.transfers_in,
    transfersInEvent: p.transfers_in_event,
    transfersOut: p.transfers_out,
    transfersOutEvent: p.transfers_out_event,
    optaCode: p.opta_code,
  };
}

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

async function fetchPlayers(): Promise<PlayerType[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const players: any[] = json?.["elements"];
    const teams = await getAllTeams();

    return players.map((p) => mapPlayer(p, teams));
  } catch (error) {
    console.error("Failed to fetch players:", error);
    throw error;
  }
}

export async function updatePlayers(): Promise<void> {
  try {
    console.log("Updating players...");
    const players = await fetchPlayers();

    const record: Record<string, string> = players.reduce(
      (acc, player) => {
        acc[player.id] = JSON.stringify(player);
        return acc;
      },
      {} as Record<string, string>,
    );

    redis.hset("players", record);

    console.log("Finished players updating players");
  } catch (error) {
    console.error("Failed to update players:", error);
  }
}

export function startPeriodicPlayerUpdates(): void {
  updatePlayers().catch(console.error);
  setInterval(() => {
    updatePlayers().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic player updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

// startPeriodicPlayerUpdates();
