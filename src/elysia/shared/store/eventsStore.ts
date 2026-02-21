const EVENTS_FILE = "./public/fpl/events.json";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

type Event = {
  id: number;
  name: string;
  deadlineTime: string;
  deadlineTimeEpoch: string;
  isCurrent: boolean;
  highestScore: number;
};

function mapEvents(t: any): Event {
  return {
    id: t.id,
    name: t.name,
    deadlineTime: t.deadline_time,
    deadlineTimeEpoch: t.deadline_time_epoch,
    isCurrent: t.is_current,
    highestScore: t.highest_score,
  };
}

let eventsById = new Map<number, Event>();
let isUpdating = false;

async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const json = await response.json();
    const events: any[] = json?.["events"];

    return events.map(mapEvents);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
}

async function updateEvents(): Promise<void> {
  // Prevent concurrent updates
  if (isUpdating) {
    console.log("Update already in progress, skipping");
    return;
  }

  isUpdating = true;

  try {
    console.log("Updating events...");
    const events = await fetchEvents();

    // Move temp to actual file (atomic on most filesystems)
    await Bun.write(EVENTS_FILE, JSON.stringify(events));

    // Update in-memory Map
    const newEventsById = new Map<number, Event>();
    for (const event of events) {
      newEventsById.set(event.id, event);
    }
    eventsById = newEventsById;
    console.log(`Events updated successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Failed to update events:", error);
    // Map remains unchanged on error
  } finally {
    isUpdating = false;
  }
}

async function initializeEvents(): Promise<void> {
  try {
    const eventsFile = Bun.file(EVENTS_FILE);

    // Check if file exists and if cache is stale
    try {
      const fileStats = await eventsFile.stat();
      const fileLastModified = fileStats.mtime.getTime();
      const now = Date.now();
      const isStale = now - fileLastModified > UPDATE_INTERVAL_MS;

      if (isStale) {
        console.log("Events cache is stale, updating immediately...");
        await updateEvents();
        return;
      }

      // Load from file if fresh
      const events = (await eventsFile.json()) as Event[];

      // Sync to in-memory cache
      const newEventsById = new Map<number, Event>();
      for (const e of events) {
        newEventsById.set(e.id, e);
      }
      eventsById = newEventsById;

      console.log(`Loaded ${events.length} events from file`);
    } catch (fileError) {
      // File doesn't exist, fetch immediately
      console.warn("Events cache file not found, fetching fresh data...");
      await updateEvents();
    }
  } catch (error) {
    console.error("Failed to initialize events:", error);
    throw error;
  }
}

function startPeriodicEventUpdates(): void {
  // Set interval for periodic updates (initialization handles the first load)
  setInterval(() => {
    updateEvents().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic Event updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

await initializeEvents();
startPeriodicEventUpdates();

export function getEventById(id: number) {
  const event = eventsById.get(id);

  if (!event) throw new Error(`Event not found for id: ${id}`);

  return event;
}

export function getAllEvents(): Event[] {
  return Array.from(eventsById.values());
}

export function getCurrentGameweekId() {
  const event = Array.from(eventsById.values()).filter((e) => e.isCurrent);

  if (!event.length) throw new Error(`Current event not found`);

  return event[0].id;
}
