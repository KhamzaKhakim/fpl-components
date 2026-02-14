import { positionById } from "@/src/utils/mapApi";
import { fplFetch } from "../../fplClient";
import { TeamsModel } from "./model";
import { FplService } from "../../shared/service/fpl/service";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";
import { FplModel } from "../../shared/service/fpl/model";

export abstract class TeamsService {
  static async getPoints({
    id,
    gw,
  }: TeamsModel.PointsBody): Promise<TeamsModel.PointsResponse> {
    const res = await FplService.getPicks({ id, gw });

    let picks: TeamsModel.PickType[] = res.picks.map(
      (p: FplModel.FplPicksType) => {
        const player = getPlayerById(p.element);

        if (!player) throw new Error(`Player by id ${p.element} not found`);

        const team = getTeamById(player.team);

        if (!team) throw new Error(`Team by id ${player.team} not found`);

        const pick: TeamsModel.PickType = {
          id: p.element,
          name: player.name,
          team: player.team,
          teamShortName: team.shortName,
          gwPoints: player.gwPoints,
          position: positionById[p.elementType],
          isCaptain: p.isCaptain,
          isViceCaptain: p.isViceCaptain,
          multiplier: p.multiplier,
        };

        return pick;
      },
    );

    return {
      activeChip: res.activeChip,
      totalPoints: res.entryHistory.points,
      picks,
    } as TeamsModel.PointsResponse;
  }
}
