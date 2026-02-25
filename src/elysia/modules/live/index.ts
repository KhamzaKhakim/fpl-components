import Elysia from "elysia";
import { t } from "elysia";

import { GetByIdRequestSchema } from "../../shared/model";
import { PointsBodySchema } from "./model";
import {
  getLivePointByPlayerAndGameweek,
  getLivePointsByGameweek,
  LiveService,
} from "./service";

const LivePointsParamsSchema = t.Object({
  gameweek: t.Number(),
  playerId: t.Number(),
});

const GameweekParamsSchema = t.Object({
  gameweek: t.Number(),
});

export const live = new Elysia({ prefix: "/live" })
  .get(
    "/:id/points/:gw",
    ({ params: { id, gw } }) => {
      return LiveService.getPoints({ id, gw });
    },
    {
      params: PointsBodySchema,
    },
  )
  .get(
    "/points/:gameweek/:playerId",
    ({ params: { gameweek, playerId } }) => {
      return getLivePointByPlayerAndGameweek(gameweek, playerId);
    },
    {
      params: LivePointsParamsSchema,
    },
  )
  .get(
    "/points/:gameweek",
    ({ params: { gameweek } }) => {
      return getLivePointsByGameweek(gameweek);
    },
    {
      params: GameweekParamsSchema,
    },
  );
