import { Elysia } from "elysia";

import { GetByIdRequestSchema } from "../../shared/model";
import { getPlayerById } from "./service";

export const players = new Elysia({ prefix: "/players" })
  .get("/", () => "Players")
  .get("/:id", ({ params: { id } }) => getPlayerById(id), {
    params: GetByIdRequestSchema,
  });
