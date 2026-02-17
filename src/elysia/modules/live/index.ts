import Elysia from "elysia";
import { LiveService } from "./service";
import { LiveModel } from "./model";

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
