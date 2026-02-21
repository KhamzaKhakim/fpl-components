type Fixture = {
  code: number;
  event: number | null;
  finished: boolean;
  // finishedProvisional: boolean;
  id: number;
  kickoffTime: string | null;
  minutes: number;
  // provisionalStartTime: boolean;
  started: boolean | null;
  teamA: number;
  teamAScore: number | null;
  teamH: number;
  teamHScore: number | null;
  // stats: {
  //   identifier: string;
  //   a: {
  //     value: number;
  //     element: number;
  //   }[];
  //   h: {
  //     value: number;
  //     element: number;
  //   }[];
  // }[];
};

function mapFixtures(f: any): Fixture {
  return {
    code: f.code,
    event: f.event ?? null,
    finished: f.finished,
    // finishedProvisional: f.finished_provisional,
    id: f.id,
    kickoffTime: f.kickoff_time ?? null,
    minutes: f.minutes,
    // provisionalStartTime: f.provisional_start_time,
    started: f.started ?? null,
    teamA: f.team_a,
    teamAScore: f.team_a_score ?? null,
    teamH: f.team_h,
    teamHScore: f.team_h_score ?? null,
  };
}

const FIXTURES_FILE = "./public/fpl/fixtures.json";
const UPDATE_INTERVAL_MS = 60 * 1000; // 1 hour

let fixturesById = new Map<number, Fixture>();
let isUpdating = false;

async function fetchFixtures(): Promise<Fixture[]> {
  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/fixtures/`,
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const fixturesJson: any[] = await response.json();

    return fixturesJson.map(mapFixtures);
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

    // Move temp to actual file (atomic on most filesystems)
    await Bun.write(FIXTURES_FILE, JSON.stringify(fixtures));

    // Update in-memory Map
    const newFixturesById = new Map<number, Fixture>();
    for (const fixture of fixtures) {
      newFixturesById.set(fixture.id, fixture);
    }
    fixturesById = newFixturesById;

    console.log(`Fixtures updated successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Failed to update fixtures:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

async function initializeFixtures(): Promise<void> {
  try {
    const fixturesFile = Bun.file(FIXTURES_FILE);

    // Check if file exists and if cache is stale
    try {
      const fileStats = await fixturesFile.stat();
      const fileLastModified = fileStats.mtime.getTime();
      const now = Date.now();
      const isStale = now - fileLastModified > UPDATE_INTERVAL_MS;

      if (isStale) {
        console.log("Fixtures cache is stale, updating immediately...");
        await updateFixtures();
        return;
      }

      // Load from file if fresh
      const fixtures = (await fixturesFile.json()) as Fixture[];

      // Sync to in-memory cache
      const newFixturesById = new Map<number, Fixture>();
      for (const f of fixtures) {
        newFixturesById.set(f.id, f);
      }
      fixturesById = newFixturesById;

      console.log(`Loaded ${fixtures.length} fixtures from file`);
    } catch (fileError) {
      // File doesn't exist, fetch immediately
      console.warn("Fixtures cache file not found, fetching fresh data...");
      await updateFixtures();
    }
  } catch (error) {
    console.error("Failed to initialize fixtures:", error);
    throw error;
  }
}

function startPeriodicFixtureUpdates(): void {
  // Set interval for periodic updates (initialization handles the first load)
  setInterval(() => {
    updateFixtures().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic Team updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

await initializeFixtures();
startPeriodicFixtureUpdates();

// Export getter function instead of raw Map
export function getFixtureById(id: number): Fixture | undefined {
  return fixturesById.get(id);
}

export function getAllFixtures(): Fixture[] {
  return Array.from(fixturesById.values());
}
