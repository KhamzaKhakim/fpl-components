import { app } from "@/src/elysia";
import { Elysia, t } from "elysia";

const elysia = new Elysia({ prefix: "/api" }).use(app);

export const GET = elysia.fetch;
export const POST = elysia.fetch;
