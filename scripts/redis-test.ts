import { LiveModel } from "@/src/elysia/modules/live/model";
import { redis } from "bun";

// const player = await redis.hget("gw-25", "1");

// const obj = JSON.parse(player!) as LiveModel.LiveType;

// console.log(JSON.stringify(obj));

// console.log(obj.fixtureIds);

// await redis.hset("test", {
//   name: "hamza",
//   age: 21,
// });

const test = await redis.hget("gw-25", "1");

console.log(typeof test);

console.log(test);
