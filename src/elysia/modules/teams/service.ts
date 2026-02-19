import { positionById } from "@/src/utils/mapApi";
import { TeamsModel } from "./model";
import { FplService } from "../../shared/service/fpl/service";
import { getTeamById } from "../../shared/store/teamsStore";
import { FplModel } from "../../shared/service/fpl/model";
import { getPlayerById } from "../../shared/store/playerStoreRedis";

export abstract class TeamsService {
  static async getPoints({
    id,
    gw,
  }: TeamsModel.PointsBody): Promise<TeamsModel.PointsResponse> {
    const res = await FplService.getPicks({ id, gw });

    let picks: TeamsModel.PickType[] = await Promise.all(
      res.picks.map(async (p: FplModel.FplPicksType) => {
        const player = await getPlayerById(p.element);

        if (!player) throw new Error(`Player by id ${p.element} not found`);

        const team = getTeamById(player.team);

        if (!team) throw new Error(`Team by id ${player.team} not found`);

        const pick: TeamsModel.PickType = {
          id: p.element,
          name: player.webName,
          team: player.team,
          teamShortName: team.shortName,
          position: positionById[p.elementType],
          isCaptain: p.isCaptain,
          isViceCaptain: p.isViceCaptain,
          multiplier: p.multiplier,
          nowCost: player.nowCost,
        };

        return pick;
      }),
    );

    return {
      activeChip: res.activeChip,
      totalPoints: res.entryHistory.points,
      picks,
    } as TeamsModel.PointsResponse;
  }
}
