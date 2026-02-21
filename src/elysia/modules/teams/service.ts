import { positionById } from "@/src/utils/mapApi";
import { TeamsModel } from "./model";
import { FplService } from "../../shared/service/fpl/service";
import { getTeamById } from "../../shared/store/teamsStore";
import { PicksModel } from "../../shared/service/fpl/model";
import { getPlayerById } from "../../shared/store/playersStore";

export abstract class TeamsService {
  static async getPoints({
    id,
    gw,
  }: TeamsModel.PointsBody): Promise<TeamsModel.PointsResponse> {
    const res = await FplService.getPicks({ id, gw });

    let picks: TeamsModel.PickType[] = await Promise.all(
      res.picks.map(async (p: PicksModel.FplPicksType) => {
        const player = getPlayerById(p.element);

        if (!player) throw new Error(`Player by id ${p.element} not found`);

        const team = getTeamById(player.team);

        if (!team) throw new Error(`Team by id ${player.team} not found`);

        const pick: TeamsModel.PickType = {
          id: p.element,
          name: player.webName,
          team: player.team,
          teamShortName: team.shortName,
          position: positionById[p.element_type],
          isCaptain: p.is_captain,
          isViceCaptain: p.is_vice_captain,
          multiplier: p.multiplier,
          nowCost: player.nowCost,
        };

        return pick;
      }),
    );

    return {
      activeChip: res.active_chip,
      totalPoints: res.entry_history.points,
      picks,
    } as TeamsModel.PointsResponse;
  }
}
