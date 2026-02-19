import { t } from "elysia";

export namespace TeamsModel {
  export const PointsBodySchema = t.Object({
    id: t.Number(),
    gw: t.Number(),
  });

  export type PointsBody = typeof PointsBodySchema.static;

  const ChipEnum = t.UnionEnum(["wildcard", "freehit", "bboost", "3xc"]);
  const PositionEnum = t.UnionEnum(["GK", "DEF", "MID", "FWD"]);

  // const AutomaticSubSchema = t.Object({
  //   elementIn: t.Number(),
  //   elementOut: t.Number(),
  //   entry: t.Number(),
  //   event: t.Number(),
  // });

  // const EntryHistorySchema = t.Object({
  //   bank: t.Number(),
  //   event: t.Number(),
  //   eventTransfers: t.Number(),
  //   eventTransfersCost: t.Number(),
  //   overallRank: t.Number(),
  //   percentileRank: t.Number(),
  //   points: t.Number(),
  //   pointsOnBench: t.Number(),
  //   rank: t.Number(),
  //   rankSort: t.Number(),
  //   totalPoints: t.Number(),
  //   value: t.Number(),
  // });

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

  export const PointsResponseSchema = t.Object({
    activeChip: t.Nullable(ChipEnum),
    totalPoints: t.Number(),
    picks: t.Array(PickSchema),
  });

  export type PointsResponse = typeof PointsResponseSchema.static;

  export type PickType = typeof PickSchema.static;
}
