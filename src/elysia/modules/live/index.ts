import Elysia from "elysia";

import { LiveModel } from "./model";
import { LiveService } from "./service";

export const live = new Elysia({ prefix: "/live" })
  //   .get("/", () => file("./public/teams.json"))
  // TODO: add typing
  .get(
    "/:id/points/:gw",
    async ({ params: { id, gw } }) => {
      return LiveService.getPoints({ id, gw });
    },
    {
      params: LiveModel.PointsBodySchema,
    },
  );
