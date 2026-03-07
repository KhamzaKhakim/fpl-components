import {
  HistoryType,
  TransfersType,
} from "@/src/elysia/modules/transfers/model";
import { apiFetcher } from "@/src/elysia/modules/utils/fetcher";

import { ManagerResponse, PicksResponse } from "./model";

type FplApi = {
  [x: `/entry/${number}/event/${number}/picks/`]: PicksResponse;
  [x: `/entry/${number}`]: ManagerResponse;
  [x: `/entry/${number}/history`]: HistoryType;
  [x: `/entry/${number}/transfers`]: TransfersType;
};
export const fplFetcher = apiFetcher<FplApi>(
  "https://fantasy.premierleague.com/api",
);
