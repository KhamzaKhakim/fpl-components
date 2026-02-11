import { Elysia, file, t } from "elysia";
import { getCurrentGameweekId } from "../utils/gameweekUtils";
import { playersById, teamsById } from "../utils/store";
import { positionById } from "@/src/utils/mapApi";
import { fplFetch } from "../../fplClient";

export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => file("./public/teams.json"))
  // TODO: add typing
  .get(
    "/:id/points/:gw?",
    async ({ params: { id, gw } }) => {
      let gameweek = gw;

      if (!gameweek) gameweek = await getCurrentGameweekId();

      const ans = await fplFetch(`/${id}/event/${gameweek}/picks/`);

      let picks = ans.picks.map((p: any) => {
        const player = playersById.get(p?.element);
        const team = teamsById.get(player?.team!);
        return {
          ...p,
          ...player,
          teamName: team?.name || "",
          teamShortName: team?.shortName || "short",
          position: positionById[p.element_type],
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
        gw: t.Optional(t.Number()),
      }),
    },
  )
  .get(
    "/:id/transfers",
    async ({ params: { id } }) => {
      const gameweek = await getCurrentGameweekId();
      const ans = await fplFetch(`/${id}/event/${gameweek}/picks/`);

      let picks = ans.picks.map((p: any) => {
        const player = playersById.get(p?.element);
        const team = teamsById.get(player?.team!);
        return {
          ...p,
          ...player,
          teamName: team?.name || "",
          teamShortName: team?.shortName || "short",
          position: positionById[p.element_type],
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
