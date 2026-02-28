/* eslint-disable @typescript-eslint/no-explicit-any */
import { redis } from "bun";

import { FixtureType } from "@/src/elysia/modules/fixtures/model";

function mapFixture(f: any): FixtureType {
  return {
    code: f.code,
    event: f.event,
    finished: f.finished,
    finishedProvisional: f.finished_provisional,
    id: f.id,
    kickoffTime: f.kickoff_time,
    minutes: f.minutes,
    provisionalStartTime: f.provisional_start_time,
    started: f.started,
    teamA: f.team_a,
    teamAScore: f.team_a_score,
    teamH: f.team_h,
    teamHScore: f.team_h_score,
    stats: f.stats,
    teamHDifficulty: f.team_h_difficulty,
    teamADifficulty: f.team_a_difficulty,
    pulseId: f.pulse_id,
  };
}

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

async function fetchFixtures(): Promise<FixtureType[]> {
  try {
    const response = await fetch(
      "https://fantasy.premierleague.com/api/fixtures/",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const fixtures: any[] = await response.json();

    return fixtures.map(mapFixture);
  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    throw error;
  }
}

async function updateFixtures(): Promise<void> {
  try {
    console.log("Updating fixtures...");
    const fixtures = await fetchFixtures();

    const record: Record<string, string> = fixtures.reduce(
      (acc, fixture) => {
        acc[`fixture:${fixture.id}`] = JSON.stringify(fixture);
        return acc;
      },
      {} as Record<string, string>,
    );

    redis.hset("fixtures", record);

    console.log("Finished updating fixtures");
  } catch (error) {
    console.error("Failed to update fixtures:", error);
  }
}

export function startPeriodicFixtureUpdates(): void {
  updateFixtures().catch(console.error);
  setInterval(() => {
    updateFixtures().catch(console.error);
  }, UPDATE_INTERVAL_MS);

  console.log(
    `Periodic fixture updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
  );
}

// startPeriodicFixtureUpdates();
