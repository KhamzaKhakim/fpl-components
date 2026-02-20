import { TeamType } from "../../modules/teams/types";

const TEAMS_FILE = "./public/teams.json";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

let teamsById = new Map<number, TeamType>();
let isUpdating = false;
let lastUpdateTime = 0;

type Team = {
  code: number;
  draw: number;
  form: string | null;
  id: number;
  loss: number;
  name: string;
  played: number;
  points: number;
  position: number;
  short_name: string;
  strength: number;
  team_division: number | null;
  unavailable: boolean;
  win: number;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
  pulse_id: number;
};

async function fetchTeams(): Promise<TeamType[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const teams: Team[] = json?.["teams"];

    const teamsMapped = teams.map(
      (t) =>
        ({
          id: t.id,
          code: t.code,
          name: t.name,
          shortName: t.short_name,
          strengthOverallHome: t.strength_overall_home,
          strengtHoverallAway: t.strength_overall_away,
          strengthAttackHome: t.strength_attack_home,
          strengthAttackAway: t.strength_attack_away,
          strengthDefenceHome: t.strength_defence_home,
          strengthDefenceAway: t.strength_defence_away,
        }) as TeamType,
    );

    return teamsMapped;
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

    // Write to temp file first, then move (atomic operation)
    const tempFile = `${TEAMS_FILE}.tmp`;
    await Bun.write(tempFile, JSON.stringify(teams, null, 2));

    // Move temp to actual file (atomic on most filesystems)
    await Bun.write(TEAMS_FILE, await Bun.file(tempFile).text());

    // Update in-memory Map
    const newMap = new Map<number, TeamType>();
    for (const team of teams) {
      newMap.set(team.id, team);
    }
    teamsById = newMap;

    lastUpdateTime = Date.now();
    console.log(`Teams updated successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Failed to update teams:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

// Load teams on startup
async function initializeTeams(): Promise<void> {
  try {
    const teamsFile = Bun.file(TEAMS_FILE);
    const teams = (await teamsFile.json()) as TeamType[];

    for (const fixture of teams) {
      teamsById.set(fixture.id, fixture);
    }

    console.log(`Loaded ${teamsById.size} teams from file`);
    lastUpdateTime = Date.now();
  } catch (error) {
    console.warn(
      "Could not load teams from file, starting with empty map:",
      error,
    );
    // Try to fetch immediately if file doesn't exist
    await updateTeams();
  }
}

// Start periodic updates
function startPeriodicUpdates(): void {
  // Update immediately on start
  updateTeams().catch(console.error);

  // Then set interval
  setInterval(() => {
    updateTeams().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic fixture updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

// Initialize and start
await initializeTeams();
startPeriodicUpdates();

// Export getter function instead of raw Map
export function getTeamById(id: number): TeamType | undefined {
  return teamsById.get(id);
}

export function getAllTeams(): TeamType[] {
  return Array.from(teamsById.values());
}

export function getLastUpdateTime(): number {
  return lastUpdateTime;
}

// For debugging
export function forceUpdate(): Promise<void> {
  return updateTeams();
}
