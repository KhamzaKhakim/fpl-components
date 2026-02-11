import { Elysia, t } from "elysia";
import { players } from "./modules/players";
import { teams } from "./modules/teams";
import { dns } from "bun";

dns.prefetch("https://fantasy.premierleague.com");

export const app = new Elysia({ prefix: "/api" })
  .use(players)
  .use(teams)
  .get("/", () => "Hello");

export type TApp = typeof app;
