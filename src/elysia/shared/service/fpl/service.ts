import { fplFetch } from "@/src/elysia/fplClient";
import { FplModel } from "./model";

export abstract class FplService {
  static async getPicks({
    id,
    gw,
  }: FplModel.PicksBody): Promise<FplModel.PicksResponse> {
    return fplFetch(`/entry/${id}/event/${gw}/picks/`);
  }
}
