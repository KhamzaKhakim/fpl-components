import { Value } from "@sinclair/typebox/value";

import { positionById } from "@/src/utils/mapApi";

import { fplFetch } from "../../fplClient";
import { FplPicksType } from "../../shared/service/fpl/model";
import { getPicks } from "../../shared/service/fpl/service";
import { getCurrentGameweekId } from "../gameweeks/cache";
import { getPlayerById } from "../players/cache";
import { getTeamById } from "../teams/cache";
import { ChipType } from "../teams/types";
import {
  HistorySchema,
  HistoryType,
  PickType,
  TransfersBody,
  TransfersResponse,
  TransfersSchema,
} from "./model";

export async function getTransfers({
  id,
}: TransfersBody): Promise<TransfersResponse> {
  const gw = await getCurrentGameweekId();
  const res = await getPicks({ id, gw });

  const picks: PickType[] = await Promise.all(
    res.picks.map(async (p: FplPicksType) => {
      const player = await getPlayerById(p.element);

      if (!player) throw new Error(`Player by id ${p.element} not found`);

      const team = await getTeamById(player.team);

      if (!team) throw new Error(`Team by id ${player.team} not found`);

      const pick: PickType = {
        id: p.element,
        name: player.webName,
        team: player.team,
        teamShortName: team.shortName,
        position: positionById[p.element_type],
        isCaptain: p.is_captain,
        isViceCaptain: p.is_vice_captain,
        multiplier: p.multiplier,
        nowCost: player.nowCost,
      };

      return pick;
    }),
  );

  return {
    activeChip: res.active_chip,
    totalPoints: res.entry_history.points,
    picks,
  };
}

export async function getAvailableTransfers(id: number) {
  const chips = await getUsedChips(id);
  const firstGameweek = (await getGameweeksHistory(id))[0];
  const transfers = await getFplTransfers(id);
}

export async function getUsedChips(id: number) {
  const history = await fplFetch(`/entry/${id}/history`);

  if (!Value.Check(HistorySchema, history))
    throw new Error(`Invalid history response for id: ${id}`);

  const res = history.chips.reduce(
    (acc, curr) => {
      if (!acc[curr.name]) {
        acc[curr.name] = [curr];
      } else {
        acc[curr.name].push(curr);
      }

      return acc;
    },
    {} as Record<ChipType, HistoryType["chips"]>,
  );

  return res;
}

export async function getGameweeksHistory(id: number) {
  const history = await fplFetch(`/entry/${id}/history`);

  if (!Value.Check(HistorySchema, history))
    throw new Error(`Invalid history response for id: ${id}`);

  return history.current.map((h) => ({
    event: h.event,
    points: h.points,
    totalPoints: h.total_points,
    rank: h.rank,
    rankSort: h.rank_sort,
    overallRank: h.overall_rank,
    percentileRank: h.percentile_rank,
    bank: h.bank,
    value: h.value,
    eventTransfers: h.event_transfers,
    eventTransfersCost: h.event_transfers_cost,
    pointsOnBench: h.points_on_bench,
  }));
}

export async function getFplTransfers(id: number) {
  const transfers = await fplFetch(`/entry/${id}/transfers`);

  if (!Value.Check(TransfersSchema, transfers))
    throw new Error(`Invalid transfers response for id: ${id}`);

  return transfers.map((t) => ({
    elementIn: t.element_in,
    elementInCost: t.element_in_cost,
    elementOut: t.element_out,
    elementOutCost: t.element_out_cost,
    entry: t.entry,
    event: t.event,
    time: t.time,
  }));
}
