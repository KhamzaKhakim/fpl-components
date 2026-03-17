import { positionById } from "@/src/utils/mapApi";

import { fplFetcher } from "../../shared/service/fpl/service";
import { getAllPlayers } from "../players/cache";
import { getAllTeams } from "../teams/cache";
import * as LiveCache from "./cache";
import { LivePickType, LivePointsResponse, LiveType } from "./model";

export async function getLivePoints(
  id: number,
  gw: number,
): Promise<LivePointsResponse> {
  const res = await fplFetcher.fetch(`/entry/${id}/event/${gw}/picks/`);

  const picks: LivePickType[] = [];
  const playersMap = await getAllPlayers();
  const teamsMap = await getAllTeams();

  for (let i = 0; i < res.picks.length; i++) {
    const p = res.picks[i];

    const player = playersMap.get(p.element);

    if (!player) throw new Error(`Player by id ${p.element} not found`);

    const livePoint = await LiveCache.getLivePointByPlayerAndGameweek(
      gw,
      player.id,
    );

    if (!livePoint)
      throw new Error(`Live point for player with id ${p.element} not found`);

    const pick: LivePickType = {
      id: p.element,
      name: player.webName,
      team: player.team,
      teamShortName: player.teamShortName,
      gwPoints: livePoint.gwPoints,
      position: player.position,
      isCaptain: p.is_captain,
      isViceCaptain: p.is_vice_captain,
      multiplier: p.multiplier,
      fixtureIds: livePoint.fixtureIds,
      fixtures: livePoint.fixtures,
      fixturesFinished: livePoint.fixturesFinished,
      minutes: livePoint.minutes,
    };

    picks.push(pick);
  }

  return {
    activeChip: res.active_chip,
    totalPoints: res.entry_history.points,
    picks,
  };
}

export async function getLivePointByPlayerAndGameweek(
  gameweek: number,
  playerId: number,
): Promise<LiveType> {
  return LiveCache.getLivePointByPlayerAndGameweek(gameweek, playerId);
}

export async function getLivePointsByGameweek(
  gameweek: number,
): Promise<LiveType[]> {
  return LiveCache.getLivePointsByGameweek(gameweek);
}
