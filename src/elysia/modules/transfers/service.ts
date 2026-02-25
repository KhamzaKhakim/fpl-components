import { positionById } from "@/src/utils/mapApi";

import { PicksModel } from "../../shared/service/fpl/model";
import { FplService } from "../../shared/service/fpl/service";
import { getCurrentGameweekId } from "../gameweeks/cache";
import { getPlayerById } from "../players/cache";
import { getTeamById } from "../teams/cache";
import { TransfersModel } from "./model";

export abstract class TransfersService {
  static async getTransfers({
    id,
  }: TransfersModel.TransfersBody): Promise<TransfersModel.TransfersResponse> {
    const gw = await getCurrentGameweekId();
    const res = await FplService.getPicks({ id, gw });

    const picks: TransfersModel.PickType[] = await Promise.all(
      res.picks.map(async (p: PicksModel.FplPicksType) => {
        const player = await getPlayerById(p.element);

        if (!player) throw new Error(`Player by id ${p.element} not found`);

        const team = await getTeamById(player.team);

        if (!team) throw new Error(`Team by id ${player.team} not found`);

        const pick: TransfersModel.PickType = {
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
    };
  }
}
