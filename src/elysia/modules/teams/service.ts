import { positionById } from "@/src/utils/mapApi";
import { fplFetch } from "../../fplClient";
import { TeamsModel } from "./model";
import { FplService } from "../../shared/service/fpl/service";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";

export abstract class TeamsService {
  static async getPoints({
    id,
    gw,
  }: TeamsModel.PointsBody): Promise<TeamsModel.PointsResponse> {
    const res = (await fplFetch(
      `/${id}/event/${gw}/picks/`,
    )) as TeamsModel.PointsResponse;

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

    return { ...res, picks } as TeamsModel.PointsResponse;
  }
}
