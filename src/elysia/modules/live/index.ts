import Elysia from "elysia";

import { PointsBodySchema } from "./model";
import { LiveService } from "./service";

export const live = new Elysia({ prefix: "/live" }).get(
  "/:id/points/:gw",
  ({ params: { id, gw } }) => {
    return LiveService.getPoints({ id, gw });
  },
  {
    params: PointsBodySchema,
  },
);
