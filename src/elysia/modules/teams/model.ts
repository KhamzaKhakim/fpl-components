import { t } from "elysia";

export namespace TeamsModel {
  export const PointsBodySchema = t.Object({
    id: t.Number(),
    gw: t.Optional(t.Number()),
  });

  export type PointsBody = typeof PointsBodySchema.static;

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

  const PickSchema = t.Object({
    element: t.Number(),
    elementType: t.Number(),
    isCaptain: t.Boolean(),
    isViceCaptain: t.Boolean(),
    multiplier: t.Number(),
    position: t.Number(),
  });

  export const PointsResponseSchema = t.Object({
    activeChip: t.Nullable(chip),
    automaticSubs: t.Array(AutomaticSubSchema),
    entryHistory: EntryHistorySchema,
    picks: t.Array(PickSchema),
  });

  export type PointsResponse = typeof PointsResponseSchema.static;
}
