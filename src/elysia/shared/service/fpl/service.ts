import { fplFetch } from "@/src/elysia/fplClient";
import { HistoryType } from "@/src/elysia/modules/transfers/model";

import { ManagerResponse, PicksBody, PicksResponse } from "./model";

export async function getPicks({ id, gw }: PicksBody): Promise<PicksResponse> {
  return fplFetch(`/entry/${id}/event/${gw}/picks/`);
}

export async function getManagerInfo(id: number): Promise<ManagerResponse> {
  return fplFetch(`/entry/${id}`);
}

export async function getHistory(id: number): Promise<HistoryType> {
  return fplFetch(`/entry/${id}/history`);
}
