import { t } from "elysia";

export const LiveSchema = t.Object({
  id: t.Number(),
  totalPoints: t.Number(),
  fixtureIds: t.Array(t.Number()),
  fixtures: t.Array(t.String()),
  fixturesFinished: t.Array(t.Boolean()),
});

export type LiveType = typeof LiveSchema.static;
