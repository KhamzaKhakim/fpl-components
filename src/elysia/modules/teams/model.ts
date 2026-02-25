import { t } from "elysia";

export const TeamSchema = t.Object({
  id: t.Number(),
  code: t.Number(),
  name: t.String(),
  shortName: t.String(),
  strength: t.Number(),
  position: t.Number(),
});

export type TeamType = typeof TeamSchema.static;
