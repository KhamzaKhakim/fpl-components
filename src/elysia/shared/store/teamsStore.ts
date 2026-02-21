const TEAMS_FILE = "./public/fpl/teams.json";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

type Team = {
  id: number;
  code: number;
  name: string;
  shortName: string;
  strength: number;
  position: number;
};

function mapTeams(t: any): Team {
  return {
    id: t.id,
    code: t.code,
    name: t.name,
    shortName: t.short_name,
    strength: t.strength,
    position: t.position,
  };
}

let teamsById = new Map<number, Team>();
let isUpdating = false;

async function fetchTeams(): Promise<Team[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const teams: any[] = json?.["teams"];

    return teams.map(mapTeams);
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    throw error;
  }
}

async function updateTeams(): Promise<void> {
  // Prevent concurrent updates
  if (isUpdating) {
    console.log("Update already in progress, skipping");
    return;
  }

  isUpdating = true;

  try {
    console.log("Updating teams...");
    const teams = await fetchTeams();

    // Move temp to actual file (atomic on most filesystems)
    await Bun.write(TEAMS_FILE, JSON.stringify(teams));

    // Update in-memory Map
    const newTeamsById = new Map<number, Team>();
    for (const team of teams) {
      newTeamsById.set(team.id, team);
    }
    teamsById = newTeamsById;
    console.log(`Teams updated successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Failed to update teams:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

async function initializeTeams(): Promise<void> {
  try {
    const teamsFile = Bun.file(TEAMS_FILE);

    // Check if file exists and if cache is stale
    try {
      const fileStats = await teamsFile.stat();
      const fileLastModified = fileStats.mtime.getTime();
      const now = Date.now();
      const isStale = now - fileLastModified > UPDATE_INTERVAL_MS;

      if (isStale) {
        console.log("teams cache is stale, updating immediately...");
        await updateTeams();
        return;
      }

      // Load from file if fresh
      const teams = (await teamsFile.json()) as Team[];

      // Sync to in-memory cache
      const newTeamsById = new Map<number, Team>();
      for (const p of teams) {
        newTeamsById.set(p.id, p);
      }
      teamsById = newTeamsById;

      console.log(`Loaded ${teams.length} teams from file`);
    } catch (fileError) {
      // File doesn't exist, fetch immediately
      console.warn("teams cache file not found, fetching fresh data...");
      await updateTeams();
    }
  } catch (error) {
    console.error("Failed to initialize teams:", error);
    throw error;
  }
}

function startPeriodicTeamUpdates(): void {
  // Set interval for periodic updates (initialization handles the first load)
  setInterval(() => {
    updateTeams().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic Team updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

await initializeTeams();
startPeriodicTeamUpdates();

export function getTeamById(id: number) {
  const team = teamsById.get(id);

  if (!team) throw new Error(`Team not found for id: ${id}`);

  return team;
}

export function getAllTeams(): Team[] {
  return Array.from(teamsById.values());
}
