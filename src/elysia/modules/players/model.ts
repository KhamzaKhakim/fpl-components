import { t } from "elysia";

export const PlayerSchema = t.Object({
  id: t.Number(),
  webName: t.String(),
  team: t.Number(),
  selectedByPercent: t.String(),
  totalPoints: t.Number(),
  nowCost: t.Number(),
  elementType: t.Number(),
  canSelect: t.Boolean(),
  epNext: t.String(),
  epThis: t.String(),
  chanceOfPlayingNextRound: t.Nullable(t.Number()),
  chanceOfPlayingThisRound: t.Nullable(t.Number()),
  form: t.String(),
  transfersIn: t.Number(),
  transfersInEvent: t.Number(),
  transfersOut: t.Number(),
  transfersOutEvent: t.Number(),
  optaCode: t.String(),
});

export type PlayerType = typeof PlayerSchema.static;
