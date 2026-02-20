import { getLivePoint } from "@/src/elysia/shared/store/livePointsStore";

const oriley26 = await getLivePoint({ gw: 26, player: 411 });
console.log(oriley26);

const oriley25 = await getLivePoint({ gw: 25, player: 411 });
console.log(oriley25);

const oriley24 = await getLivePoint({ gw: 24, player: 411 });
console.log(oriley24);
