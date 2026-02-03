import { Elysia, file, t } from "elysia";
import { getCurrentGameweekId } from "../utils/gameweekUtils";
import { playersById, teamsById } from "../utils/store";
import { positionById } from "@/src/utils/mapApi";

export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => file("./public/teams.json"))
  .get("/:id", async ({ params: { id } }) => {
    const currentGameweek = await getCurrentGameweekId();
    const response = await fetch(
      `https://fantasy.premierleague.com/api/entry/${id}/event/${currentGameweek}/picks/`,
    );
    const ans = await response.json();

    let picks = ans.picks.map((p: any) => ({
      ...p,
      ...playersById.get(p?.element),
      teamName: teamsById.get(p.team),
      teamShortName: teamsById.get(p.team),
      position: positionById[p.element_type],
    }));
    return { ...ans, picks };
  });
