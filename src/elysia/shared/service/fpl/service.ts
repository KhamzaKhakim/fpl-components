import { fplFetch } from "@/src/elysia/fplClient";
import { ManagerModel, PicksModel } from "./model";

export abstract class FplService {
  static async getPicks({
    id,
    gw,
  }: PicksModel.Body): Promise<PicksModel.Response> {
    //TODO: snake_case
    return fplFetch(`/entry/${id}/event/${gw}/picks/`);
  }
  static async getManagerInfo(id: number): Promise<ManagerModel.Response> {
    return fplFetch(`/entry/${id}`);
  }
}
