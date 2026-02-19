import camelcaseKeys from "camelcase-keys";
import { redis } from "bun";

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let isUpdating = false;

type Player = {
  id: number;
  webName: string;
  team: number;
  selectedByPercent: number;
  totalPoints: number;
  nowCost: number;
  elementType: number;
  canSelect: boolean;
  epNext: string;
  epThis: string;
  chanceOfPlayingNextRound: null;
  chanceOfPlayingThisRound: null;
  form: string;
  transfersIn: number;
  transfersInEvent: number;
  transfersOut: number;
  transfersOutEvent: number;
  optaCode: string;
};

async function fetchPlayers(): Promise<Player[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const players = json?.["elements"];

    const camelCaselivePlayers = camelcaseKeys(players, {
      deep: true,
    }) as Player[];

    return camelCaselivePlayers;
  } catch (error) {
    console.error("Failed to fetch players:", error);
    throw error;
  }
}

async function updatePlayers(): Promise<void> {
  if (isUpdating) {
    console.log("Update already in progress, skipping");
    return;
  }

  isUpdating = true;

  try {
    console.log("Updating players...");
    const players = await fetchPlayers();

    for (const p of players) {
      redis.set(`player-${p.id}`, JSON.stringify(p));
    }
    console.log("Finished players updating players");
  } catch (error) {
    console.error("Failed to update players:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

function startPeriodicUpdates(): void {
  // Update immediately on start
  updatePlayers().catch(console.error);

  // Then set interval
  setInterval(() => {
    updatePlayers().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic fixture updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

startPeriodicUpdates();

export async function getPlayerById(id: number) {
  const playersString = await redis.get(`player-${id}`);

  if (!playersString) throw new Error(`Player not found for id: ${id}`);

  const livePoint = JSON.parse(playersString) as Player;

  return livePoint;
}
