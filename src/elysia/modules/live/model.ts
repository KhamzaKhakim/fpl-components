import { t } from "elysia";

import { ChipEnum, PositionEnum } from "../../shared/service/fpl/model";

export const LiveRequestSchema = t.Object({
  id: t.Number(),
  gw: t.Number(),
});

export type LiveRequestType = typeof LiveRequestSchema.static;

export const LivePlayerGwRequestSchema = t.Object({
  id: t.Number(),
  gw: t.Number(),
});

export type LivePlayerGwRequestType = typeof LivePlayerGwRequestSchema.static;

export const LiveGwSchema = t.Object({
  id: t.Number(),
  gw: t.Number(),
});

export type LiveGwType = typeof LiveGwSchema.static;

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
  position: PositionEnum,
  isCaptain: t.Boolean(),
  isViceCaptain: t.Boolean(),
  multiplier: t.Number(),
  fixtureIds: t.Array(t.Number()),
  fixtures: t.Array(t.String()),
  fixturesFinished: t.Array(t.Boolean()),
  minutes: t.Array(t.Number()),
});

export const LivePointsResponseSchema = t.Object({
  activeChip: t.Nullable(ChipEnum),
  totalPoints: t.Number(),
  picks: t.Array(LivePickSchema),
});

export type LivePointsResponse = typeof LivePointsResponseSchema.static;

export type LivePickType = typeof LivePickSchema.static;
