import { t } from "elysia";

export const teamBody = t.Object({
  id: t.Number(),
  code: t.Number(),
  name: t.String(),
  shortName: t.String(),
  strengthOverallHome: t.Number(),
  strengtHoverallAway: t.Number(),
  strengthAttackHome: t.Number(),
  strengthAttackAway: t.Number(),
  strengthDefenceHome: t.Number(),
  strengthDefenceAway: t.Number(),
});

export type TeamType = typeof teamBody.static;
