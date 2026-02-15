import { t } from "elysia";
import { FplModel } from "../../shared/service/fpl/model";

export namespace LiveModel {
  export const PointsBodySchema = t.Object({
    id: t.Number(),
    gw: t.Number(),
  });

  export type PointsBody = typeof PointsBodySchema.static;

  export const LiveSchema = t.Object({
    id: t.Number(),
    gwPoints: t.Number(),
    fixtureIds: t.Array(t.Number()),
    minutes: t.Array(t.Number()),
    fixtures: t.Array(t.String()),
    fixturesFinished: t.Array(t.Boolean()),
  });

  export type LiveType = typeof LiveSchema.static;

  export const LivePickSchema = t.Object({
    id: t.Number(),
    name: t.String(),
    team: t.Number(),
    teamShortName: t.String(),
    gwPoints: t.Number(),
    position: FplModel.PositionEnum,
    isCaptain: t.Boolean(),
    isViceCaptain: t.Boolean(),
    multiplier: t.Number(),
    fixtureIds: t.Array(t.Number()),
    fixtures: t.Array(t.String()),
    fixturesFinished: t.Array(t.Boolean()),
    minutes: t.Array(t.Number()),
  });

  export const LivePointsResponseSchema = t.Object({
    activeChip: t.Nullable(FplModel.ChipEnum),
    totalPoints: t.Number(),
    picks: t.Array(LivePickSchema),
  });

  export type LivePointsResponse = typeof LivePointsResponseSchema.static;

  export type LivePickType = typeof LivePickSchema.static;
}
