import { positionById } from "@/src/utils/mapApi";
import { fplFetch } from "../../fplClient";
import { playersById, teamsById } from "../utils/store";
import { TeamsModel } from "./model";
import { FplService } from "../../shared/service/fpl/service";

export abstract class TeamsService {
  static async getPoints({
    id,
    gw,
  }: TeamsModel.PointsBody): Promise<TeamsModel.PointsResponse> {
    const res = (await fplFetch(
      `/${id}/event/${gw}/picks/`,
    )) as TeamsModel.PointsResponse;

    let picks = res.picks.map((p: any) => {
      const player = playersById.get(p?.element);
      const team = teamsById.get(player?.team!);
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
