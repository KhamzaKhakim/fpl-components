import { t } from "elysia";

export const TransfersBodySchema = t.Object({
  id: t.Number(),
});

export type TransfersBody = typeof TransfersBodySchema.static;

const ChipEnum = t.UnionEnum(["wildcard", "freehit", "bboost", "3xc"]);
const PositionEnum = t.UnionEnum(["GK", "DEF", "MID", "FWD"]);

export const PickSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  team: t.Number(),
  teamShortName: t.String(),
  position: PositionEnum,
  isCaptain: t.Boolean(),
  isViceCaptain: t.Boolean(),
  multiplier: t.Number(),
  nowCost: t.Number(),
});

export const TransfersResponseSchema = t.Object({
  activeChip: t.Nullable(ChipEnum),
  totalPoints: t.Number(),
  picks: t.Array(PickSchema),
});

export type TransfersResponse = typeof TransfersResponseSchema.static;

export type PickType = typeof PickSchema.static;
