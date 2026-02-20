import camelcaseKeys from "camelcase-keys";

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

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
let isUpdating = false;
let playersById = new Map<number, Player>();

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

    //Optimize this part
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

    await Bun.write(`./public/fpl/players.json`, JSON.stringify(players));

    const newPlayersById = new Map<number, Player>();
    for (const p of players) {
      newPlayersById.set(p.id, p);
    }

    playersById = newPlayersById;
    console.log("Finished players updating players");
  } catch (error) {
    console.error("Failed to update players:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

async function initializePlayers(): Promise<void> {
  try {
    const playersFile = Bun.file("./public/fpl/players.json");

    // Check if file exists and if cache is stale
    try {
      const fileStats = await playersFile.stat();
      const fileLastModified = fileStats.mtime.getTime();
      const now = Date.now();
      const isStale = now - fileLastModified > UPDATE_INTERVAL_MS;

      if (isStale) {
        console.log("Players cache is stale, updating immediately...");
        await updatePlayers();
        return;
      }

      // Load from file if fresh
      const players = (await playersFile.json()) as Player[];

      // Sync to in-memory cache
      const newPlayersById = new Map<number, Player>();
      for (const p of players) {
        newPlayersById.set(p.id, p);
      }
      playersById = newPlayersById;

      console.log(`Loaded ${players.length} players from file`);
    } catch (fileError) {
      // File doesn't exist, fetch immediately
      console.warn("Players cache file not found, fetching fresh data...");
      await updatePlayers();
    }
  } catch (error) {
    console.error("Failed to initialize players:", error);
    throw error;
  }
}

function startPeriodicPlayerUpdates(): void {
  // Set interval for periodic updates (initialization handles the first load)
  setInterval(() => {
    updatePlayers().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic player updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

await initializePlayers();
startPeriodicPlayerUpdates();

export function getPlayerById(id: number) {
  const player = playersById.get(id);

  if (!player) throw new Error(`Player not found for id: ${id}`);

  return player;
}
