import { Elysia, file, t } from "elysia";
import { getCurrentGameweekId } from "../utils/gameweekUtils";

export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => file("./public/teams.json"))
  .get("/:id", async ({ params: { id } }) => {
    const currentGameweek = await getCurrentGameweekId();
    const response = await fetch(
      `https://fantasy.premierleague.com/api/entry/${id}/event/${currentGameweek}/picks/`,
    );
    const ans = await response.json();
    return ans;
  });
