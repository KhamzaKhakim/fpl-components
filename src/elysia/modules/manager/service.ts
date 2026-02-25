import { getManagerInfo } from "../../shared/service/fpl/service";
import { ManagerModel } from "./model";

export abstract class ManagerService {
  static async getInfo({
    id,
  }: ManagerModel.InfoBody): Promise<ManagerModel.InfoResponse> {
    const res = await getManagerInfo(id);
    return {
      id: res.id,
      name: res.name,
      favouriteTeam: res.favourite_team,
      firstName: res.player_first_name,
      lastName: res.player_last_name,
      regionId: res.player_region_id,
      regionName: res.player_region_name,
      regionNameShort: res.player_region_iso_code_long,
      summaryOverallPoints: res.summary_overall_points,
      summaryOverallRank: res.summary_overall_rank,
      summaryEventPoints: res.summary_event_points,
      summaryEventRank: res.summary_event_rank,
      lastDeadlineBank: res.last_deadline_bank,
      lastDeadlineValue: res.last_deadline_value,
      classicLeagues: res.leagues.classic.map((l) => ({
        id: l.id,
        name: l.name,
        entryRank: l.entry_rank,
        entryLastRank: l.entry_last_rank,
      })),
    };
  }
}
