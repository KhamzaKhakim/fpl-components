import { t } from "elysia";

export const PlanSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  startGw: t.Number(),
  endGw: t.Number(),
  valid: t.Boolean({ default: true }),
});

export type PlanType = typeof PlanSchema.static;
