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

export const HistorySchema = t.Object({
  current: t.Array(
    t.Object({
      event: t.Number(),
      points: t.Number(),
      total_points: t.Number(),
      rank: t.Number(),
      rank_sort: t.Number(),
      overall_rank: t.Number(),
      percentile_rank: t.Number(),
      bank: t.Number(),
      value: t.Number(),
      event_transfers: t.Number(),
      event_transfers_cost: t.Number(),
      points_on_bench: t.Number(),
    }),
  ),

  past: t.Array(
    t.Object({
      season_name: t.String(),
      total_points: t.Number(),
      rank: t.Number(),
    }),
  ),

  chips: t.Array(
    t.Object({
      name: ChipEnum,
      time: t.String({ format: "date-time" }),
      event: t.Number(),
    }),
  ),
});

export type HistoryType = typeof HistorySchema.static;

export const TransfersSchema = t.Array(
  t.Object({
    element_in: t.Number(),
    element_in_cost: t.Number(),
    element_out: t.Number(),
    element_out_cost: t.Number(),
    entry: t.Number(),
    event: t.Number(),
    time: t.String({ format: "date-time" }),
  }),
);

export type TransfersType = typeof TransfersSchema.static;
