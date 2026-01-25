import { Player } from "../components/Transfers";

export function isPlayer(obj: any): obj is Player {
  if (obj?.["name"] && obj?.["team"]) {
    return true;
  }

  return false;
}
