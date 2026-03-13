import { t } from "elysia";

import { ChipEnum, PositionEnum } from "../../shared/service/fpl/model";

export const TransfersBodySchema = t.Object({
  id: t.Number(),
});

export type TransfersBody = typeof TransfersBodySchema.static;

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
  sellCost: t.Number(),
});

export const TransfersResponseSchema = t.Object({
  picks: t.Array(PickSchema),
  bank: t.Number(),
  limit: t.Number(),
  gw: t.Number(),
  availableChips: t.Array(ChipEnum),
});

export type TransfersResponse = typeof TransfersResponseSchema.static;

export type PickType = typeof PickSchema.static;

export const TransferPlanSchema = t.Composite([
  TransfersResponseSchema,
  t.Object({
    chip: t.Nullable(ChipEnum),
    transfers: t.Array(
      t.Object({
        transferIn: t.Number(),
        transferOut: t.Number(),
      }),
    ),
  }),
]);

export type TransferPlan = typeof TransferPlanSchema.static;
