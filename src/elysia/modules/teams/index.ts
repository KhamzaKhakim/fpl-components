import { Elysia } from "elysia";

import { GetByIdRequestSchema } from "../../shared/model";
import { getTeamById } from "./service";
import { getAllTeamsArray } from "./cache";
export const teams = new Elysia({ prefix: "/teams" })
  //TODO: fix to service
  .get("/", () => getAllTeamsArray())
  .get("/:id", ({ params: { id } }) => getTeamById(id), {
    params: GetByIdRequestSchema,
  });
