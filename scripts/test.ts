import {
  getCurrentGameweekId,
  getGameweekById,
} from "@/src/elysia/modules/gameweeks/cache";
import { getPlayerById } from "@/src/elysia/modules/players/cache";

const a = await getGameweekById(27);

console.log(a);

const curr = await getCurrentGameweekId();

console.log(curr);

const raya = await getPlayerById(1);

console.log(raya);
