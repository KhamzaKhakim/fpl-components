// import { LiveModel } from "../../modules/live/model";
// import { getCurrentGameweekId } from "./eventsStore";
// import { getFixtureById } from "./fixturesStore";
// import { getPlayerById } from "./playersStore";
// import { getTeamById } from "./teamsStore";

// const getLivePointsFile = (gw: number) =>
//   `./public/fpl/gameweek-points/gw-${gw}.json`;

// export type FplPlayerStat = {
//   id: number;
//   stats: {
//     minutes: number;
//     goalsScored: number;
//     assists: number;
//     cleanSheets: number;
//     goalsConceded: number;
//     ownGoals: number;
//     penaltiesSaved: number;
//     penaltiesMissed: number;
//     yellowCards: number;
//     redCards: number;
//     saves: number;
//     bonus: number;
//     bps: number;
//     influence: string;
//     creativity: string;
//     threat: string;
//     ictIndex: string;
//     clearancesBlocksInterceptions: number;
//     recoveries: number;
//     tackles: number;
//     defensiveContribution: number;
//     starts: number;
//     expectedGoals: string;
//     expectedAssists: string;
//     expectedGoalInvolvements: string;
//     expectedGoalsConceded: string;
//     totalPoints: number;
//     inDreamTeam: boolean;
//   };
//   explain: {
//     fixture: number;
//     stats: {
//       identifier: string;
//       points: number;
//       value: number;
//       pointsModification: number;
//     }[];
//   }[];
//   modified: boolean;
// };

// const UPDATE_INTERVAL_MS = 60 * 1000; // 1 hour
// let isUpdating = false;
// // Map structure: gameweek -> (player id -> live points)
// const livePointsByGameweek = new Map<number, Map<number, LiveModel.LiveType>>();
// let currentGameweek = 0;

// async function fetchLivePoints(): Promise<LiveModel.LiveType[]> {
//   try {
//     const gw = getCurrentGameweekId();

//     if (!gw) throw new Error("Current gameweek not found");

//     const response = await fetch(
//       `https://fantasy.premierleague.com/api/event/${gw}/live/`,
//     );

//     if (!response.ok) {
//       throw new Error(`API returned ${response.status}`);
//     }

//     const liveResponse = await response.json();

//     const liveElements: any[] = liveResponse.elements;

//     const fixedLivePoints = liveElements
//       .map((element) => {
//         const player = getPlayerById(element.id);
//         if (!player) return null;

//         const team = getTeamById(player.team);
//         if (!team) return null;

//         const fixtureIds: number[] = [];
//         const fixtures: string[] = [];
//         const fixturesFinished: boolean[] = [];
//         const minutes: number[] = [];

//         for (const explain of element.explain) {
//           const fixture = getFixtureById(explain.fixture);
//           if (!fixture) continue;

//           fixtureIds.push(fixture.id);
//           fixturesFinished.push(fixture.finished);
//           minutes.push(fixture.minutes);

//           const isHome = fixture.teamH === team.id;
//           const opponentId = isHome ? fixture.teamA : fixture.teamH;
//           const opponent = getTeamById(opponentId);

//           fixtures.push(
//             `${opponent?.shortName ?? "UNK"}(${isHome ? "H" : "A"})`,
//           );
//         }

//         return {
//           id: element.id,
//           gwPoints: element.stats.total_points,
//           minutes,
//           fixtureIds,
//           fixtures,
//           fixturesFinished,
//         } satisfies LiveModel.LiveType;
//       })
//       .filter((v) => v != null);

//     return fixedLivePoints;
//   } catch (error) {
//     console.error("Failed to fetch livePoints:", error);
//     throw error;
//   }
// }

// async function updateLivePoints(): Promise<void> {
//   if (isUpdating) {
//     console.log("Update already in progress, skipping");
//     return;
//   }

//   isUpdating = true;

//   try {
//     const gw = getCurrentGameweekId();

//     if (!gw) throw new Error("Current gameweek not found");

//     // Check if gameweek changed
//     if (gw !== currentGameweek) {
//       console.log(`Gameweek changed from ${currentGameweek} to ${gw}`);
//       currentGameweek = gw;
//     }

//     console.log("Updating livePoints for gw: " + gw);
//     const livePoints = await fetchLivePoints();

//     // Update file
//     await Bun.write(getLivePointsFile(gw), JSON.stringify(livePoints));

//     // Build new inner map completely before replacing (atomic operation)
//     const newGwPointsMap = new Map<number, LiveModel.LiveType>();
//     for (const point of livePoints) {
//       newGwPointsMap.set(point.id, point);
//     }

//     // Atomic update of this gameweek's map
//     livePointsByGameweek.set(gw, newGwPointsMap);
//     console.log("Finished updating gw: " + gw);
//   } catch (error) {
//     console.error("Failed to update livePoints:", error);
//     // Maps remain unchanged on error
//   } finally {
//     isUpdating = false;
//   }
// }

// async function initializeLivePoints(): Promise<void> {
//   try {
//     const gw = getCurrentGameweekId();

//     if (!gw) throw new Error("Current gameweek not found");

//     currentGameweek = gw;

//     // Load all available gameweek files (1 to current) without stale checks
//     for (let i = 1; i <= gw; i++) {
//       try {
//         const livePointsFile = Bun.file(getLivePointsFile(i));

//         // Load from file
//         const livePoints =
//           (await livePointsFile.json()) as LiveModel.LiveType[];

//         // Create map for this gameweek
//         const gwPointsMap = new Map<number, LiveModel.LiveType>();
//         for (const point of livePoints) {
//           gwPointsMap.set(point.id, point);
//         }

//         livePointsByGameweek.set(i, gwPointsMap);
//         console.log(
//           `Loaded ${livePoints.length} live points for gameweek ${i}`,
//         );
//       } catch (fileError) {
//         console.log("Error");
//         // File doesn't exist for this gameweek, skip silently
//         // This handles cases where current gameweek just changed but file doesn't exist yet
//       }
//     }

//     // Check if current gameweek is loaded, and if so, check for staleness
//     if (livePointsByGameweek.has(gw)) {
//       try {
//         const livePointsFile = Bun.file(getLivePointsFile(gw));
//         const fileStats = await livePointsFile.stat();
//         const fileLastModified = fileStats.mtime.getTime();
//         const now = Date.now();
//         const isStale = now - fileLastModified > UPDATE_INTERVAL_MS;

//         if (isStale) {
//           console.log(`Current gameweek ${gw} cache is stale, updating...`);
//           await updateLivePoints();
//         } else {
//           console.log(`Current gameweek ${gw} cache is fresh`);
//         }
//       } catch (error) {
//         console.warn(`Failed to check staleness for gameweek ${gw}`);
//       }
//     } else {
//       // Current gameweek not loaded, fetch immediately
//       console.log(`Current gameweek ${gw} not found, fetching fresh data...`);
//       await updateLivePoints();
//     }
//   } catch (error) {
//     console.error("Failed to initialize livePoints:", error);
//     throw error;
//   }
// }

// function startPeriodicUpdates(): void {
//   // Set interval for periodic updates (initialization handles the first load)
//   setInterval(() => {
//     updateLivePoints().catch(console.error);
//   }, UPDATE_INTERVAL_MS);

//   console.log(
//     `Periodic live points updates started (interval: ${UPDATE_INTERVAL_MS}ms)`,
//   );
// }

// await initializeLivePoints();
// startPeriodicUpdates();

// export function getLivePoint({
//   gw,
//   player,
// }: {
//   gw: number;
//   player: number;
// }): LiveModel.LiveType {
//   const gwPointsMap = livePointsByGameweek.get(gw);

//   if (!gwPointsMap) throw new Error(`Gameweek ${gw} not found in cache`);

//   const livePoint = gwPointsMap.get(player);

//   if (livePoint == null) {
//     throw new Error(`Live point not found for gw: ${gw}, player: ${player}`);
//   }

//   return livePoint;
// }
