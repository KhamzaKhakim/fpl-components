import { Elysia, t } from "elysia";

export const players = new Elysia({ prefix: "/players" }).get(
  "/",
  () => "Players",
);
