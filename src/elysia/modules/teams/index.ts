import { Elysia, file, t } from "elysia";
import { getCurrentGameweekId } from "../utils/gameweekUtils";
import { positionById } from "@/src/utils/mapApi";
import { fplFetch } from "../../fplClient";
import { TeamsModel } from "./model";
import { getPlayerById } from "../../shared/store/playersStore";
import { getTeamById } from "../../shared/store/teamsStore";
import { LiveService } from "../live/service";
import { FplService } from "../../shared/service/fpl/service";

export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => file("./public/teams.json"))
  // TODO: add typing
  .get(
    "/:id/transfers",
    async ({ params: { id } }) => {
      const gameweek = await getCurrentGameweekId();

      const ans = await FplService.getPicks({ id, gw: gameweek });

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
        activeChip: any;
        automaticSubs: any[];
        entryHistory: object;
        picks: any[];
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    },
  );
