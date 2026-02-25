import { positionById } from "@/src/utils/mapApi";

import { FplService } from "../../shared/service/fpl/service";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";
import * as LiveCache from "./cache";
import {
  LivePickType,
  LivePointsResponse,
  LiveRequestType,
  LiveType,
} from "./model";

export async function getLivePoints({
  id,
  gw,
}: LiveRequestType): Promise<LivePointsResponse> {
  const res = await FplService.getPicks({ id, gw });

  const picks: LivePickType[] = [];

  for (let i = 0; i < res.picks.length; i++) {
    const p = res.picks[i];

    const player = getPlayerById(p.element);

    if (!player) throw new Error(`Player by id ${p.element} not found`);

    const team = getTeamById(player.team);

    if (!team) throw new Error(`Team by id ${player.team} not found`);

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
      teamShortName: team.shortName,
      gwPoints: livePoint.gwPoints,
      position: positionById[p.element_type],
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
