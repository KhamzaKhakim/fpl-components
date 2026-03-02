import { Value } from "@sinclair/typebox/value";

import { positionById } from "@/src/utils/mapApi";

import { fplFetch } from "../../fplClient";
import { ChipEnum, FplPicksType } from "../../shared/service/fpl/model";
import { getPicks } from "../../shared/service/fpl/service";
import { getCurrentGameweekId } from "../gameweeks/cache";
import { getNextGameweekId } from "../gameweeks/service";
import { getPlayerById } from "../players/cache";
import { PlayerType } from "../players/model";
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

      const transfers = await getFplTransfers(id);

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
        sellCost: calculateSellCost({ player, transfers }),
      };

      return pick;
    }),
  );

  const { limit, bank } = await getTransferInfo(id);

  return {
    picks,
    limit,
    bank,
  };
}

export async function getTransferInfo(
  id: number,
  // picks: Awaited<ReturnType<typeof getPicks>>["picks"],
) {
  const chips = await getUsedChips(id);
  const firstGw = (await getGameweeksHistory(id))[0];
  const nextGw = await getNextGameweekId();

  const history = await fplFetch(`/entry/${id}/history`);

  if (!Value.Check(HistorySchema, history))
    throw new Error(`Invalid history response for id: ${id}`);

  const transfers = await getFplTransfers(id);

  const a = Object.values(ChipEnum);

  const availableChips =
    nextGw > 19
      ? ["wildcard", "freehit", "bboost", "3xc"].filter(
          (c) =>
            !history.chips
              .filter((c) => c.event > 19)
              .map((c) => c.name)
              .includes(c),
        )
      : ["wildcard", "freehit", "bboost", "3xc"].filter(
          (c) => !history.chips.map((c) => c.name).includes(c),
        );

  const fts = calculateFts({
    transfers,
    firstGw: firstGw.event,
    nextGw,
    chips,
  });

  const bank = await calculateBank({
    transfers,
    firstGw: firstGw.event,
    chips,
    id,
  });

  return {
    bank,
    limit: fts,
    availableChips,
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

function calculateFts({
  transfers,
  firstGw,
  nextGw,
  chips,
}: {
  transfers: { event: number }[];
  firstGw: number;
  nextGw: number;
  chips: Awaited<ReturnType<typeof getUsedChips>>;
}): number {
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

async function calculateBank({
  id,
  firstGw,
  transfers,
  chips,
}: {
  id: number;
  firstGw: number;
  transfers: Awaited<ReturnType<typeof getFplTransfers>>;
  chips: Awaited<ReturnType<typeof getUsedChips>>;
}) {
  const transfersReversed = transfers.toReversed();

  const res = await getPicks({ id, gw: firstGw });

  const initialPlayerPrices = await Promise.all(
    res.picks.map(async (p) => await getPlayerById(p.element)),
  );

  let bank =
    1000 -
    initialPlayerPrices.reduce(
      (acc, curr) => acc + (curr.nowCost - curr.costChangeStart),
      0,
    );

  for (let i = 0; i < transfersReversed.length; i++) {
    if (chips.freehit.map((v) => v.event).includes(transfersReversed[i].event))
      continue;

    bank =
      bank -
      transfersReversed[i].elementInCost +
      transfersReversed[i].elementOutCost;
  }

  return bank;
}

function calculateSellCost({
  player,
  transfers,
}: {
  player: PlayerType;
  transfers: Awaited<ReturnType<typeof getFplTransfers>>;
}) {
  const inPrice =
    transfers.find((t) => t.elementIn == player.id)?.elementInCost ??
    player.nowCost - player.costChangeStart;

  if (player.nowCost <= inPrice) return player.nowCost;

  return inPrice + Math.floor((player.nowCost - inPrice) / 2);
}
