import { Value } from "@sinclair/typebox/value";

import { positionById } from "@/src/utils/mapApi";

import { fplFetch } from "../../fplClient";
import { FplPicksType } from "../../shared/service/fpl/model";
import { getPicks } from "../../shared/service/fpl/service";
import { getCurrentGameweekId } from "../gameweeks/cache";
import { getNextGameweekId } from "../gameweeks/service";
import { getInfo } from "../manager/service";
import { getPlayerById } from "../players/cache";
import { getTeamById } from "../teams/cache";
import { ChipType } from "../teams/types";
import {
  HistorySchema,
  HistoryType,
  PickType,
  TransfersResponse,
  TransfersSchema,
} from "./model";

export async function getTransfers(id: number): Promise<TransfersResponse> {
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

export async function getTransferInfo(id: number) {
  const chips = await getUsedChips(id);
  const firstGameweek = (await getGameweeksHistory(id))[0];
  const nextGw = await getNextGameweekId();
  const transfers = await getFplTransfers(id);
  const fts = calculateFts(transfers, firstGameweek.event, nextGw, chips);
  const info = await getInfo(id);

  return {
    bank: info.lastDeadlineBank,
    value: info.lastDeadlineValue,
    limit: fts,
  };
}

async function getUsedChips(id: number) {
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

async function getGameweeksHistory(id: number) {
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

async function getFplTransfers(id: number) {
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

const AFCON_GW = 16;

function calculateFts(
  transfers: { event: number }[],
  firstGw: number,
  nextGw: number,
  chips: Awaited<ReturnType<typeof getUsedChips>>,
): number {
  const freehitGws = chips["freehit"].map((v) => v.event);
  const wildcardGws = chips["wildcard"].map((v) => v.event);

  const nTransfers: Record<number, number> = {};
  for (let i = 2; i < nextGw; i++) nTransfers[i] = 0;
  for (const t of transfers) {
    nTransfers[t.event] += 1;
  }

  const fts: Record<number, number> = {};
  for (let i = firstGw + 1; i <= nextGw; i++) fts[i] = 0;
  fts[firstGw + 1] = 1;

  for (let i = firstGw + 2; i <= nextGw; i++) {
    if (i === AFCON_GW) {
      fts[i] = 5;
      continue;
    }
    if (freehitGws.includes(i - 1) || wildcardGws.includes(i - 1)) {
      fts[i] = fts[i - 1];
      continue;
    }
    fts[i] = fts[i - 1];
    fts[i] -= nTransfers[i - 1];
    fts[i] = Math.max(fts[i], 0);
    fts[i] += 1;
    fts[i] = Math.min(fts[i], 5);
  }

  return fts[nextGw];
}
