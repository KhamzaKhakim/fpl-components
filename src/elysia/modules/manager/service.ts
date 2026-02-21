import { FplService } from "../../shared/service/fpl/service";
import { ManagerModel } from "./model";

export abstract class ManagerService {
  static async getInfo({
    id,
  }: ManagerModel.InfoBody): Promise<ManagerModel.InfoResponse> {
    const res = await FplService.getManagerInfo(id);
    return { id: 5 };
  }
}
