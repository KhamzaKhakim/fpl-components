import { t } from "elysia";

export const FixtureSchema = t.Object({
  code: t.Number(),
  event: t.Nullable(t.Number()),
  finished: t.Boolean(),
  finishedProvisional: t.Boolean(),
  id: t.Number(),
  kickoffTime: t.Nullable(t.String()),
  minutes: t.Number(),
  provisionalStartTime: t.Boolean(),
  started: t.Nullable(t.Boolean()),
  teamA: t.Number(),
  teamAScore: t.Nullable(t.Number()),
  teamH: t.Number(),
  teamHScore: t.Nullable(t.Number()),
  stats: t.Array(
    t.Object({
      identifier: t.String(),
      a: t.Array(
        t.Object({
          value: t.Number(),
          element: t.Number(),
        }),
      ),
      h: t.Array(
        t.Object({
          value: t.Number(),
          element: t.Number(),
        }),
      ),
    }),
  ),
  teamHDifficulty: t.Number(),
  teamADifficulty: t.Number(),
  pulseId: t.Number(),
});

export type FixtureType = typeof FixtureSchema.static;
