import { positionById } from "@/src/utils/mapApi";
import { fplFetch } from "../../fplClient";
import { FplService } from "../../shared/service/fpl/service";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";
import { TeamsModel } from "../teams/model";

export abstract class LiveService {
  static async getPoints({
    id,
    gw,
  }: TeamsModel.PointsBody): Promise<TeamsModel.PointsResponse> {
    const res = await FplService.getPicks({ id, gw });

    let picks = res.picks.map((p: any) => {
      const player = getPlayerById(p?.element);
      const team = getTeamById(player?.team!);
      return {
        ...p,
        ...player,
        teamName: team?.name || "",
        teamShortName: team?.shortName || "short",
        position: positionById[p.elementType],
      };
    });

    return {
      activeChip: res.activeChip,
      totalPoints: res.entryHistory.totalPoints,
      picks,
    } as TeamsModel.PointsResponse;
  }
}
