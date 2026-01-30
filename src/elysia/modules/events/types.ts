import { t } from "elysia";

export const eventBody = t.Object({
  id: t.Number(),
  name: t.String(),
  deadlinetime: t.String(),
  deadlineTimeEpoch: t.String(),
  isCurrent: t.Boolean(),
  highestScore: t.Number(),
});

export type EventType = typeof eventBody.static;
