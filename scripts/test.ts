import {
  getAllGameweeks,
  getGameweekById,
} from "@/src/elysia/modules/gameweeks/cache";

const a = await getGameweekById(27);

console.log(a);

const all = await getAllGameweeks();

console.log(all);
