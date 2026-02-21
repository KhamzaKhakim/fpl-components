import { Elysia, file, t } from "elysia";
import { positionById } from "@/src/utils/mapApi";
import { TeamsModel } from "./model";
import { getTeamById } from "../../shared/store/teamsStore";
import { FplService } from "../../shared/service/fpl/service";
import { PicksModel } from "../../shared/service/fpl/model";
import { getCurrentGameweekId } from "../../shared/store/eventsStore";
import { getPlayerById } from "../../shared/store/playersStore";

export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => file("./public/teams.json"))
  // TODO: add typing
  .get(
    "/:id/transfers",
    async ({ params: { id } }) => {
      const gameweek = getCurrentGameweekId();

      const ans = await FplService.getPicks({ id, gw: gameweek });

      let picks = ans.picks.map((p: PicksModel.FplPicksType) => {
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
      });

      return { activeChip: ans.active_chip, picks } as {
        activeChip: any;
        automaticSubs: any[];
        entryHistory: object;
        picks: TeamsModel.PickType[];
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    },
  );
