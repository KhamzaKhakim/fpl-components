import { Elysia } from "elysia";

import { GetByIdRequestSchema } from "../../shared/model";
import { getAllFixtures, getFixtureById } from "./service";

export const fixtures = new Elysia({ prefix: "/fixtures" })
  .get("/", () => getAllFixtures())
  .get("/:id", ({ params: { id } }) => getFixtureById(id), {
    params: GetByIdRequestSchema,
  });
