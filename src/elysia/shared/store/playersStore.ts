import { PlayerType } from "../../modules/players/types";

const PLAYERS_FILE = "./public/players.json";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let playersById = new Map<number, PlayerType>();
let isUpdating = false;
let lastUpdateTime = 0;

type Player = {
  id: number;
  web_name: string;
  team: number;
  team_code: number;
  selected_by_percent: number;
  event_points: number;
  total_points: number;
  now_cost: number;
};

async function fetchPlayers(): Promise<PlayerType[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const players: Player[] = json?.["elements"];

    const playersMapped = players.map(
      (p) =>
        ({
          id: p.id,
          name: p.web_name,
          team: p.team,
          teamCode: p.team_code,
          selectedByPercent: p.selected_by_percent,
          gwPoints: p.event_points,
          totalPoints: p.total_points,
          price: p.now_cost,
        }) as PlayerType,
    );

    return playersMapped;
  } catch (error) {
    console.error("Failed to fetch players:", error);
    throw error;
  }
}

async function updatePlayers(): Promise<void> {
  // Prevent concurrent updates
  if (isUpdating) {
    console.log("Update already in progress, skipping");
    return;
  }

  isUpdating = true;

  try {
    console.log("Updating players...");
    const players = await fetchPlayers();

    // Write to temp file first, then move (atomic operation)
    const tempFile = `${PLAYERS_FILE}.tmp`;
    await Bun.write(tempFile, JSON.stringify(players, null, 2));

    // Move temp to actual file (atomic on most filesystems)
    await Bun.write(PLAYERS_FILE, await Bun.file(tempFile).text());

    // Update in-memory Map
    const newMap = new Map<number, PlayerType>();
    for (const player of players) {
      newMap.set(player.id, player);
    }
    playersById = newMap;

    lastUpdateTime = Date.now();
    console.log(`Players updated successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Failed to update players:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

// Load players on startup
async function initializeplayers(): Promise<void> {
  try {
    const playersFile = Bun.file(PLAYERS_FILE);
    const players = (await playersFile.json()) as PlayerType[];

    for (const fixture of players) {
      playersById.set(fixture.id, fixture);
    }

    console.log(`Loaded ${playersById.size} players from file`);
    lastUpdateTime = Date.now();
  } catch (error) {
    console.warn(
      "Could not load players from file, starting with empty map:",
      error,
    );
    // Try to fetch immediately if file doesn't exist
    await updatePlayers();
  }
}

// Start periodic updates
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

// Initialize and start
await initializeplayers();
startPeriodicUpdates();

// Export getter function instead of raw Map
export function getPlayerById(id: number): PlayerType | undefined {
  return playersById.get(id);
}

export function getAllPlayers(): PlayerType[] {
  return Array.from(playersById.values());
}

export function getLastUpdateTime(): number {
  return lastUpdateTime;
}

// For debugging
export function forceUpdate(): Promise<void> {
  return updatePlayers();
}
