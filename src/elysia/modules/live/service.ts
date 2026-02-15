import { positionById } from "@/src/utils/mapApi";
import { FplService } from "../../shared/service/fpl/service";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";
import { FplModel } from "../../shared/service/fpl/model";
import { LiveModel } from "./model";
import { getLivePointById } from "../../shared/store/livePointsStore";

export abstract class LiveService {
  static async getPoints({
    id,
    gw,
  }: LiveModel.PointsBody): Promise<LiveModel.LivePointsResponse> {
    const res = await FplService.getPicks({ id, gw });

    let picks: LiveModel.LivePickType[] = res.picks.map(
      (p: FplModel.FplPicksType) => {
        const player = getPlayerById(p.element);

        if (!player) throw new Error(`Player by id ${p.element} not found`);

        const team = getTeamById(player.team);

        if (!team) throw new Error(`Team by id ${player.team} not found`);

        const livePoint = getLivePointById(p.element);

        if (!livePoint)
          throw new Error(
            `Live point for player with id ${p.element} not found`,
          );

        const pick: LiveModel.LivePickType = {
          id: p.element,
          name: player.name,
          team: player.team,
          teamShortName: team.shortName,
          gwPoints: player.gwPoints,
          position: positionById[p.elementType],
          isCaptain: p.isCaptain,
          isViceCaptain: p.isViceCaptain,
          multiplier: p.multiplier,
          fixtureIds: livePoint.fixtureIds,
          fixtures: livePoint.fixtures,
          fixturesFinished: livePoint.fixturesFinished,
        };

        return pick;
      },
    );
    return {
      activeChip: res.activeChip,
      totalPoints: res.entryHistory.points,
      picks,
    };
  }
}
