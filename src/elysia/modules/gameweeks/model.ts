import { t } from "elysia";

export const GameweekSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  deadlineTime: t.String({ format: "date-time" }),
  deadlineTimeEpoch: t.Number(),
  isCurrent: t.Boolean(),
  finished: t.Boolean(),
  highestScore: t.Nullable(t.Number()),
});

export type GameweekType = typeof GameweekSchema.static;
