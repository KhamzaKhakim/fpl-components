import camelcaseKeys from "camelcase-keys";
import { FixtureType } from "../../modules/fixtures/types";

const FIXTURES_FILE = "./public/fixtures.json";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

let fixturesById = new Map<number, FixtureType>();
let isUpdating = false;
let lastUpdateTime = 0;

async function fetchFixtures(): Promise<FixtureType[]> {
  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/fixtures/`,
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const fixturesJson = await response.json();
    const camelCaseFixturesJson = camelcaseKeys(fixturesJson, { deep: true });

    return camelCaseFixturesJson;
  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    throw error;
  }
}

async function updateFixtures(): Promise<void> {
  // Prevent concurrent updates
  if (isUpdating) {
    console.log("Update already in progress, skipping");
    return;
  }

  isUpdating = true;

  try {
    console.log("Updating fixtures...");
    const fixtures = await fetchFixtures();

    // Write to temp file first, then move (atomic operation)
    const tempFile = `${FIXTURES_FILE}.tmp`;
    await Bun.write(tempFile, JSON.stringify(fixtures, null, 2));

    // Move temp to actual file (atomic on most filesystems)
    await Bun.write(FIXTURES_FILE, await Bun.file(tempFile).text());

    // Update in-memory Map
    const newMap = new Map<number, FixtureType>();
    for (const fixture of fixtures) {
      newMap.set(fixture.id, fixture);
    }
    fixturesById = newMap;

    lastUpdateTime = Date.now();
    console.log(`Fixtures updated successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Failed to update fixtures:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

// Load fixtures on startup
async function initializeFixtures(): Promise<void> {
  try {
    const fixturesFile = Bun.file(FIXTURES_FILE);
    const fixtures = (await fixturesFile.json()) as FixtureType[];

    for (const fixture of fixtures) {
      fixturesById.set(fixture.id, fixture);
    }

    console.log(`Loaded ${fixturesById.size} fixtures from file`);
    lastUpdateTime = Date.now();
  } catch (error) {
    console.warn(
      "Could not load fixtures from file, starting with empty map:",
      error,
    );
    // Try to fetch immediately if file doesn't exist
    await updateFixtures();
  }
}

// Start periodic updates
function startPeriodicUpdates(): void {
  // Update immediately on start
  updateFixtures().catch(console.error);

  // Then set interval
  setInterval(() => {
    updateFixtures().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic fixture updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

// Initialize and start
await initializeFixtures();
startPeriodicUpdates();

// Export getter function instead of raw Map
export function getFixtureById(id: number): FixtureType | undefined {
  return fixturesById.get(id);
}

export function getAllFixtures(): FixtureType[] {
  return Array.from(fixturesById.values());
}

export function getLastUpdateTime(): number {
  return lastUpdateTime;
}

// For debugging
export function forceUpdate(): Promise<void> {
  return updateFixtures();
}
