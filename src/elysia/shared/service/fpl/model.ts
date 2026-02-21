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
  const ActivePhaseSchema = t.Object({
    phase: t.Number(),
    rank: t.Number(),
    last_rank: t.Number(),
    rank_sort: t.Number(),
    total: t.Number(),
    league_id: t.Number(),
    rank_count: t.Number(),
    entry_percentile_rank: t.Number(),
  });

  const ClassicLeagueSchema = t.Object({
    id: t.Number(),
    name: t.String(),
    short_name: t.Nullable(t.String()),
    created: t.String(),
    closed: t.Boolean(),

    rank: t.Nullable(t.Number()),
    max_entries: t.Nullable(t.Number()),

    league_type: t.String(),
    scoring: t.String(),

    admin_entry: t.Nullable(t.Number()),
    start_event: t.Number(),

    entry_can_leave: t.Boolean(),
    entry_can_admin: t.Boolean(),
    entry_can_invite: t.Boolean(),

    has_cup: t.Boolean(),
    cup_league: t.Nullable(t.Number()),
    cup_qualified: t.Nullable(t.Boolean()),

    rank_count: t.Number(),
    entry_percentile_rank: t.Number(),

    active_phases: t.Array(ActivePhaseSchema),

    featured_entry_ids: t.Array(t.Number()),

    entry_rank: t.Number(),
    entry_last_rank: t.Number(),
  });

  const CupMatchSchema = t.Object({
    id: t.Number(),

    entry_1_entry: t.Number(),
    entry_1_name: t.String(),
    entry_1_player_name: t.String(),
    entry_1_points: t.Number(),
    entry_1_win: t.Number(),
    entry_1_draw: t.Number(),
    entry_1_loss: t.Number(),
    entry_1_total: t.Number(),

    entry_2_entry: t.Number(),
    entry_2_name: t.String(),
    entry_2_player_name: t.String(),
    entry_2_points: t.Number(),
    entry_2_win: t.Number(),
    entry_2_draw: t.Number(),
    entry_2_loss: t.Number(),
    entry_2_total: t.Number(),

    is_knockout: t.Boolean(),
    league: t.Number(),
    winner: t.Nullable(t.Number()),
    seed_value: t.Nullable(t.Number()),
    event: t.Number(),
    tiebreak: t.Nullable(t.String()),
    is_bye: t.Boolean(),
    knockout_name: t.String(),
  });

  const CupSchema = t.Object({
    matches: t.Array(t.Unknown()),
    status: t.Object({
      qualification_event: t.Nullable(t.Number()),
      qualification_numbers: t.Nullable(t.Number()),
      qualification_rank: t.Nullable(t.Number()),
      qualification_state: t.Nullable(t.String()),
    }),
    cup_league: t.Nullable(t.Number()),
  });

  const LeaguesSchema = t.Object({
    classic: t.Array(ClassicLeagueSchema),
    h2h: t.Array(t.Unknown()),
    cup: CupSchema,
    cup_matches: t.Array(CupMatchSchema),
    event: t.Array(t.Unknown()),
  });

  export const ResponseSchema = t.Object({
    id: t.Number(),
    joined_time: t.String(),
    started_event: t.Number(),
    favourite_team: t.Number(),

    player_first_name: t.String(),
    player_last_name: t.String(),

    player_region_id: t.Number(),
    player_region_name: t.String(),
    player_region_iso_code_short: t.String(),
    player_region_iso_code_long: t.String(),

    years_active: t.Number(),

    summary_overall_points: t.Number(),
    summary_overall_rank: t.Number(),

    summary_event_points: t.Number(),
    summary_event_rank: t.Number(),

    current_event: t.Number(),

    leagues: LeaguesSchema,

    name: t.String(),
    name_change_blocked: t.Boolean(),

    entered_events: t.Array(t.Number()),

    kit: t.Nullable(t.Unknown()),

    last_deadline_bank: t.Number(),
    last_deadline_value: t.Number(),
    last_deadline_total_transfers: t.Number(),

    club_badge_src: t.Nullable(t.String()),
  });

  export type Response = typeof ResponseSchema.static;
}
