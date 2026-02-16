import { LiveModel } from "@/src/elysia/modules/live/model";
import { FplModel } from "@/src/elysia/shared/service/fpl/model";
import { redis } from "bun";

const player = await redis.hget("gw-25", "1");

const obj = JSON.parse(player!) as LiveModel.LiveType;

console.log(JSON.stringify(obj));

console.log(obj.fixtureIds);
