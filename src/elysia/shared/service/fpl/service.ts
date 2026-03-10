import { apiFetcher } from "@/src/elysia/modules/utils/fetcher";

import {
  FplHistoryResponse,
  FplManagerResponse,
  FplPicksResponse,
  FplTransfersResponse,
} from "./model";

type FplApi = {
  [x: `/entry/${number}/event/${number}/picks/`]: FplPicksResponse;
  [x: `/entry/${number}`]: FplManagerResponse;
  [x: `/entry/${number}/history`]: FplHistoryResponse;
  [x: `/entry/${number}/transfers`]: FplTransfersResponse;
};
export const fplFetcher = apiFetcher<FplApi>(
  "https://fantasy.premierleague.com/api",
);
