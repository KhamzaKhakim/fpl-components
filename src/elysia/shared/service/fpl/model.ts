import { t } from "elysia";

export namespace PicksModel {
  export const BodySchema = t.Object({
    id: t.Number(),
    gw: t.Optional(t.Number()),
  });

  export type Body = typeof BodySchema.static;

  const chip = t.UnionEnum(["wildcard", "freehit", "bboost", "3xc"]);

  //   type ChipType = typeof chip.static;

  const AutomaticSubSchema = t.Object({
    element_in: t.Number(),
    element_out: t.Number(),
    entry: t.Number(),
    event: t.Number(),
  });

  const EntryHistorySchema = t.Object({
    bank: t.Number(),
    event: t.Number(),
    event_transfers: t.Number(),
    event_transfers_cost: t.Number(),
    overall_rank: t.Number(),
    percentile_rank: t.Number(),
    points: t.Number(),
    points_on_bench: t.Number(),
    rank: t.Number(),
    rank_sort: t.Number(),
    total_points: t.Number(),
    value: t.Number(),
  });

  export const PickSchema = t.Object({
    element: t.Number(),
    element_type: t.Number(),
    is_captain: t.Boolean(),
    is_vice_captain: t.Boolean(),
    multiplier: t.Number(),
    position: t.Number(),
  });

  export const ResponseSchema = t.Object({
    active_chip: t.Nullable(chip),
    automatic_subs: t.Array(AutomaticSubSchema),
    entry_history: EntryHistorySchema,
    picks: t.Array(PickSchema),
  });

  export type Response = typeof ResponseSchema.static;
  export type FplPicksType = typeof PickSchema.static;

  export const ChipEnum = t.UnionEnum(["wildcard", "freehit", "bboost", "3xc"]);
  export const PositionEnum = t.UnionEnum(["GK", "DEF", "MID", "FWD"]);
}
export namespace ManagerModel {
  export const PicksBodySchema = t.Object({
    id: t.Number(),
    gw: t.Optional(t.Number()),
  });

  export type PicksBody = typeof PicksBodySchema.static;

  const chip = t.UnionEnum(["wildcard", "freehit", "bboost", "3xc"]);

  //   type ChipType = typeof chip.static;

  const AutomaticSubSchema = t.Object({
    elementIn: t.Number(),
    elementOut: t.Number(),
    entry: t.Number(),
    event: t.Number(),
  });

  const EntryHistorySchema = t.Object({
    bank: t.Number(),
    event: t.Number(),
    eventTransfers: t.Number(),
    eventTransfersCost: t.Number(),
    overallRank: t.Number(),
    percentileRank: t.Number(),
    points: t.Number(),
    pointsOnBench: t.Number(),
    rank: t.Number(),
    rankSort: t.Number(),
    totalPoints: t.Number(),
    value: t.Number(),
  });

  export const PickSchema = t.Object({
    element: t.Number(),
    elementType: t.Number(),
    isCaptain: t.Boolean(),
    isViceCaptain: t.Boolean(),
    multiplier: t.Number(),
    position: t.Number(),
  });

  export const ResponseSchema = t.Object({
    activeChip: t.Nullable(chip),
    automaticSubs: t.Array(AutomaticSubSchema),
    entryHistory: EntryHistorySchema,
    picks: t.Array(PickSchema),
  });

  export type Response = typeof ResponseSchema.static;
  export type FplPicksType = typeof PickSchema.static;

  export const ChipEnum = t.UnionEnum(["wildcard", "freehit", "bboost", "3xc"]);
  export const PositionEnum = t.UnionEnum(["GK", "DEF", "MID", "FWD"]);
}
