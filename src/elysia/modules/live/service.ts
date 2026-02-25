import { positionById } from "@/src/utils/mapApi";

import { FplService } from "../../shared/service/fpl/service";
import { getLivePoint } from "../../shared/store/livePointsStore";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";
import * as LiveCache from "./cache";
import {
  LivePickType,
  LivePointsResponse,
  LiveType,
  PointsBody,
} from "./model";

export abstract class LiveService {
  static async getPoints({ id, gw }: PointsBody): Promise<LivePointsResponse> {
    const res = await FplService.getPicks({ id, gw });

    const picks: LivePickType[] = [];

    for (let i = 0; i < res.picks.length; i++) {
      const p = res.picks[i];

      const player = getPlayerById(p.element);

      if (!player) throw new Error(`Player by id ${p.element} not found`);

      const team = getTeamById(player.team);

      if (!team) throw new Error(`Team by id ${player.team} not found`);

      const livePoint = await getLivePoint({ gw, player: player.id });

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
}

// Cache layer functions
export function getLivePointByPlayerAndGameweek(
  gameweek: number,
  playerId: number,
) {
  return LiveCache.getLivePointByPlayerAndGameweek(gameweek, playerId);
}

export function getLivePointsByGameweek(gameweek: number) {
  return LiveCache.getLivePointsByGameweek(gameweek);
}

export function setLivePointsForGameweek(
  gameweek: number,
  livePoints: LiveType[],
) {
  return LiveCache.setLivePointsForGameweek(gameweek, livePoints);
}
