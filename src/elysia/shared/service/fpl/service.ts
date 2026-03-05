import {
  HistoryType,
  TransfersType,
} from "@/src/elysia/modules/transfers/model";
import { apiFetcher } from "@/src/elysia/modules/utils/fetcher";

import { ManagerResponse, PicksBody, PicksResponse } from "./model";

type FplApi = {
  [x: `/entry/${number}/event/${number}/picks/`]: PicksResponse;
  [x: `/entry/${number}`]: ManagerResponse;
  [x: `/entry/${number}/history`]: HistoryType;
  [x: `/entry/${number}/transfers`]: TransfersType;
};
export const fplFetcher = apiFetcher<FplApi>(
  "https://fantasy.premierleague.com/api",
);

export async function getPicks({ id, gw }: PicksBody): Promise<PicksResponse> {
  return fplFetcher.fetch(`/entry/${id}/event/${gw}/picks/`);
}

export async function getManagerInfo(id: number): Promise<ManagerResponse> {
  return fplFetcher.fetch(`/entry/${id}`);
}

export async function getHistory(id: number): Promise<HistoryType> {
  return fplFetcher.fetch(`/entry/${id}/history`);
}
