import camelcaseKeys from "camelcase-keys";
import { getCurrentGameweekId } from "../../modules/utils/gameweekUtils";
import { getFixtureById } from "./fixturesStore";
import { getPlayerById } from "./playersStore";
import { getTeamById } from "./teamsStore";
import { LiveModel } from "../../modules/live/model";

const LIVE_POINTS_FILE = "./public/livePoints.json";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let livePointsById = new Map<number, LiveModel.LiveType>();
let isUpdating = false;
let lastUpdateTime = 0;

export type FplPlayerStat = {
  id: number;
  stats: {
    minutes: number;
    goalsScored: number;
    assists: number;
    cleanSheets: number;
    goalsConceded: number;
    ownGoals: number;
    penaltiesSaved: number;
    penaltiesMissed: number;
    yellowCards: number;
    redCards: number;
    saves: number;
    bonus: number;
    bps: number;
    influence: string;
    creativity: string;
    threat: string;
    ictIndex: string;
    clearancesBlocksInterceptions: number;
    recoveries: number;
    tackles: number;
    defensiveContribution: number;
    starts: number;
    expectedGoals: string;
    expectedAssists: string;
    expectedGoalInvolvements: string;
    expectedGoalsConceded: string;
    totalPoints: number;
    inDreamTeam: boolean;
  };
  explain: {
    fixture: number;
    stats: {
      identifier: string;
      points: number;
      value: number;
      pointsModification: number;
    }[];
  }[];
  modified: boolean;
};

type LiveResponse = {
  elements: FplPlayerStat[];
};

async function fetchLivePoints(): Promise<LiveModel.LiveType[]> {
  try {
    const gw = await getCurrentGameweekId();

    if (!gw) throw new Error("Current gameweek not found");

    const response = await fetch(
      `https://fantasy.premierleague.com/api/event/${gw}/live/`,
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    let liveResponse = (await response.json()) as LiveResponse;

    let liveElements = liveResponse.elements;

    const camelCaseliveElements = camelcaseKeys(liveElements, { deep: true });

    const fixedLivePoints = camelCaseliveElements
      .map((element) => {
        const player = getPlayerById(element.id);
        if (!player) return null;

        const team = getTeamById(player.team);
        if (!team) return null;

        const fixtureIds: number[] = [];
        const fixtures: string[] = [];
        const fixturesFinished: boolean[] = [];

        for (const explain of element.explain) {
          const fixture = getFixtureById(explain.fixture);
          if (!fixture) continue;

          fixtureIds.push(fixture.id);
          fixturesFinished.push(fixture.finished);

          const isHome = fixture.teamH === team.id;
          const opponentId = isHome ? fixture.teamA : fixture.teamH;
          const opponent = getTeamById(opponentId);

          fixtures.push(
            `${opponent?.shortName ?? "UNK"}(${isHome ? "H" : "A"})`,
          );
        }

        return {
          id: element.id,
          gwPoints: element.stats.totalPoints,
          fixtureIds,
          fixtures,
          fixturesFinished,
        } satisfies LiveModel.LiveType;
      })
      .filter((p) => p != null);

    return fixedLivePoints;
  } catch (error) {
    console.error("Failed to fetch livePoints:", error);
    throw error;
  }
}

async function updateLivePoints(): Promise<void> {
  // Prevent concurrent updates
  if (isUpdating) {
    console.log("Update already in progress, skipping");
    return;
  }

  isUpdating = true;

  try {
    console.log("Updating livePoints...");
    const livePoints = await fetchLivePoints();

    // Write to temp file first, then move (atomic operation)
    const tempFile = `${LIVE_POINTS_FILE}.tmp`;
    await Bun.write(tempFile, JSON.stringify(livePoints, null, 2));

    // Move temp to actual file (atomic on most filesystems)
    await Bun.write(LIVE_POINTS_FILE, await Bun.file(tempFile).text());

    // Update in-memory Map
    const newMap = new Map<number, LiveModel.LiveType>();
    for (const team of livePoints) {
      newMap.set(team.id, team);
    }
    livePointsById = newMap;

    lastUpdateTime = Date.now();
    console.log(
      `livePoints updated successfully at ${new Date().toISOString()}`,
    );
  } catch (error) {
    console.error("Failed to update livePoints:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

// Load livePoints on startup
async function initializelivePoints(): Promise<void> {
  try {
    const livePointsFile = Bun.file(LIVE_POINTS_FILE);
    const livePoints = (await livePointsFile.json()) as LiveModel.LiveType[];

    for (const fixture of livePoints) {
      livePointsById.set(fixture.id, fixture);
    }

    console.log(`Loaded ${livePointsById.size} livePoints from file`);
    lastUpdateTime = Date.now();
  } catch (error) {
    console.warn(
      "Could not load livePoints from file, starting with empty map:",
      error,
    );
    // Try to fetch immediately if file doesn't exist
    await updateLivePoints();
  }
}

// Start periodic updates
function startPeriodicUpdates(): void {
  // Update immediately on start
  updateLivePoints().catch(console.error);

  // Then set interval
  setInterval(() => {
    updateLivePoints().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic fixture updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

// Initialize and start
await initializelivePoints();
startPeriodicUpdates();

// Export getter function instead of raw Map
export function getLivePointById(id: number): LiveModel.LiveType | undefined {
  return livePointsById.get(id);
}

export function getAlLivePoints(): LiveModel.LiveType[] {
  return Array.from(livePointsById.values());
}

export function getLastUpdateTime(): number {
  return lastUpdateTime;
}

// For debugging
export function forceUpdate(): Promise<void> {
  return updateLivePoints();
}
