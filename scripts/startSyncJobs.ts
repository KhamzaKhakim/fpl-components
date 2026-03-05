import { startPeriodicFixtureUpdates, updateFixtures } from "./fixturesSyncJob";
import {
  startPeriodicGameweekUpdates,
  updateGameweeks,
} from "./gameweeksSyncJob";
import {
  startPeriodicLivePointsUpdates,
  updateLivePoints,
} from "./livePointsSyncJob";
import { startPeriodicPlayerUpdates, updatePlayers } from "./playersSyncJob";
import { startPeriodicTeamUpdates, updateTeams } from "./teamsSyncJob";

await updateGameweeks().catch(console.error);
await updateFixtures().catch(console.error);
await updateTeams().catch(console.error);
await updatePlayers().catch(console.error);
await updateLivePoints().catch(console.error);

startPeriodicGameweekUpdates();
startPeriodicFixtureUpdates();
startPeriodicTeamUpdates();
startPeriodicPlayerUpdates();
startPeriodicLivePointsUpdates();
