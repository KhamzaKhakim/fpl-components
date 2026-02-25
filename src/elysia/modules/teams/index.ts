import { Elysia } from "elysia";

import { GetByIdRequestSchema } from "../../shared/model";
import { getTeamById } from "./service";
export const teams = new Elysia({ prefix: "/teams" })
  .get("/", () => "Teams")
  .get("/:id", ({ params: { id } }) => getTeamById(id), {
    params: GetByIdRequestSchema,
  });
