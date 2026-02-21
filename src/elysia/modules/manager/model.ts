import { t } from "elysia";

export namespace ManagerModel {
  export const InfoBodySchema = t.Object({
    id: t.Number(),
  });

  export type InfoBody = typeof InfoBodySchema.static;

  const ClassicLeague = t.Object({
    id: t.Number(),
    name: t.String(),
    entryRank: t.Number(),
    entryLastRank: t.Number(),
  });

  export const InfoResponseSchema = t.Object({
    id: t.Number(),
    favouriteTeam: t.Number(),
    firstName: t.String(),
    lastName: t.String(),
    regionId: t.Number(),
    regionName: t.String(),
    regionNameShort: t.String(),
    summaryOverallPoints: t.Number(),
    summaryOverallRank: t.Number(),
    summaryEventPoints: t.Number(),
    summaryEventRank: t.Nullable(t.Number()),
    name: t.String(),
    lastDeadlineBank: t.Number(),
    lastDeadlineValue: t.Number(),
    classicLeagues: t.Array(ClassicLeague),
  });

  export type InfoResponse = typeof InfoResponseSchema.static;
}
