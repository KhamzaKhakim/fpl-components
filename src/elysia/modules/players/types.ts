import { t } from "elysia";

export const playerBody = t.Object({
  id: t.Number(),
  name: t.String(),
  team: t.Number(),
  teamCode: t.Number(),
  selectedByPercent: t.Number(),
  gwPoints: t.Number(),
  totalPoints: t.Number(),
  price: t.Number(),
});

export type PlayerType = typeof playerBody.static;
