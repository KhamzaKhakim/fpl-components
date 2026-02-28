import { startPeriodicFixtureUpdates } from "./fixturesSyncJob";
import { startPeriodicGameweekUpdates } from "./gameweeksSyncJob";
import { startPeriodicLivePointsUpdates } from "./livePointsSyncJob";
import { startPeriodicPlayerUpdates } from "./playersSyncJob";
import { startPeriodicTeamUpdates } from "./teamsSyncJob";

startPeriodicGameweekUpdates();
startPeriodicFixtureUpdates();
startPeriodicTeamUpdates();
startPeriodicPlayerUpdates();
startPeriodicLivePointsUpdates();
