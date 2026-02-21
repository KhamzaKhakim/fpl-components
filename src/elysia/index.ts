import { Elysia, t } from "elysia";
import { players } from "./modules/players";
import { teams } from "./modules/teams";
import { live } from "./modules/live";
import { dns } from "bun";
import { manager } from "./modules/manager";

dns.prefetch("https://fantasy.premierleague.com");

export const app = new Elysia({ prefix: "/api" })
  .onError(({ error, code, set }) => {
    switch (code) {
      case "VALIDATION":
        set.status = 400;
        break;

      case "NOT_FOUND":
        set.status = 404;
        break;

      default:
        set.status = 500;
        break;
    }

    return {
      message: (error as Readonly<Error>).message,
    };
  })
  .use(players)
  .use(teams)
  .use(live)
  .use(manager)
  .get("/", () => "Hello world!");

export type TApp = typeof app;
