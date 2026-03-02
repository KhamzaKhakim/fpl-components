import Elysia from "elysia";

import { InfoBodySchema } from "./model";
import * as ManagerService from "./service";

export const manager = new Elysia({ prefix: "/manager" })
  //   .get("/", () => file("./public/teams.json"))
  // TODO: add typing
  .get(
    "/:id",
    async ({ params: { id } }) => {
      return ManagerService.getInfo(id);
    },
    {
      params: InfoBodySchema,
    },
  );
