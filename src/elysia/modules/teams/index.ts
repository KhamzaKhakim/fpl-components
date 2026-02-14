import { Elysia, file, t } from "elysia";
import { getCurrentGameweekId } from "../utils/gameweekUtils";
import { positionById } from "@/src/utils/mapApi";
import { fplFetch } from "../../fplClient";
import { TeamsModel } from "./model";
import { TeamsService } from "./service";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";

export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => file("./public/teams.json"))
  // TODO: add typing
  .get(
    "/:id/points/:gw",
    async ({ params: { id, gw } }) => {
      let currGw = await getCurrentGameweekId();

      if (currGw == gw) {
        return TeamsService.getPoints({ id, gw: currGw });
      }

      return TeamsService.getPoints({ id, gw });
    },
    {
      params: TeamsModel.PointsBodySchema,
    },
  )
  .get(
    "/:id/transfers",
    async ({ params: { id } }) => {
      const gameweek = await getCurrentGameweekId();
      const ans = await fplFetch(`/${id}/event/${gameweek}/picks/`);

      let picks = ans.picks.map((p: any) => {
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

      return { ...ans, picks } as {
        active_chip: any;
        automatic_subs: any[];
        entry_history: object;
        picks: any[];
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    },
  );
