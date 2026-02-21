import { Elysia, file, t } from "elysia";

export const teams = new Elysia({ prefix: "/teams" }).get("/", () =>
  file("./public/teams.json"),
);
// TODO: add typing
