import { Elysia, t } from "elysia";
import { players } from "./modules/players";
import { teams } from "./modules/teams";

export const app = new Elysia()
  .use(players)
  .use(teams)
  .get("/", () => "Hello");
