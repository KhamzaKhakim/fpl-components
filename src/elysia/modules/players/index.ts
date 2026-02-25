import { Elysia } from "elysia";

export const players = new Elysia({ prefix: "/players" })
  .get("/", () => "Players")
  .get("/:id", ({ params: { id } }) => {});
