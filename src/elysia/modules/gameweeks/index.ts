import { Elysia } from "elysia";

import { GetByIdRequestSchema } from "../../shared/model";
import * as GameweeksService from "./service";

export const gameweeks = new Elysia({ prefix: "/gameweeks" })
  .get("/", () => GameweeksService.getAllGameweeks())
  .get(
    "/:id",
    ({ params: { id } }) => {
      return GameweeksService.getGameweekById(id);
    },
    {
      params: GetByIdRequestSchema,
    },
  );
