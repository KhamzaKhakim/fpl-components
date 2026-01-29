import { Elysia, t } from "elysia";

export const teams = new Elysia({ prefix: "/teams" }).get("/", () => "Teams");
