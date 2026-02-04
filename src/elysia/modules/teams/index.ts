import { Elysia, file, t } from "elysia";
import { getCurrentGameweekId } from "../utils/gameweekUtils";
import { playersById, teamsById } from "../utils/store";
import { positionById } from "@/src/utils/mapApi";

export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => file("./public/teams.json"))
  // TODO: add typing
  .get("/:id", async ({ params: { id } }) => {
    const currentGameweek = await getCurrentGameweekId();

    const response = await fetch(
      `https://fantasy.premierleague.com/api/entry/${id}/event/${currentGameweek}/picks/`,
    );

    const ans = await response.json();

    console.log(ans.picks[0]);

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

    return { ...ans, picks };
  });
