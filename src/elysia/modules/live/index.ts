import Elysia from "elysia";

import {
  LiveGwSchema,
  LivePlayerGwRequestSchema,
  LiveRequestSchema,
} from "./model";
import { getLivePoints } from "./service";

export const live = new Elysia({ prefix: "/live" })
  .get(
    "/:id/points/:gw",
    ({ params: { id, gw } }) => {
      return getLivePoints(id, gw);
    },
    {
      params: LiveRequestSchema,
    },
  )
  .get(
    "/points/:gw/:id",
    ({ params: { gw, id } }) => {
      return getLivePointByPlayerAndGameweek(gw, id);
    },
    {
      params: LivePlayerGwRequestSchema,
    },
  )
  .get(
    "/points/:gw",
    ({ params: { gw } }) => {
      return getLivePointsByGameweek(gw);
    },
    {
      params: LiveGwSchema,
    },
  );
