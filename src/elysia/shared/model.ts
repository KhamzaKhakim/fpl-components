import { t } from "elysia";

export const GetByIdRequestSchema = t.Object({
  id: t.Number(),
});
