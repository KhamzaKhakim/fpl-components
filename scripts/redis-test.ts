import { redis } from "bun";

await redis.set("greeting", "Hello from Bun!");

const greeting = await redis.get("greeting");
console.log(greeting); // "Hello from Bun!"
