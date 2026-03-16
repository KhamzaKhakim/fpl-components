import { Elysia } from "elysia";

import { GetByIdRequestSchema } from "../../shared/model";
import { getPlayerById } from "./service";
import { getAllPlayers, getAllPlayersArray } from "./cache";

export const players = new Elysia({ prefix: "/players" })
  .get("/", () => getAllPlayersArray())
  .get("/:id", ({ params: { id } }) => getPlayerById(id), {
    params: GetByIdRequestSchema,
  });
