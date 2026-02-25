import Elysia, { t } from "elysia";

import { TransfersService } from "./service";

export const transfers = new Elysia({ prefix: "/transfers" }).get(
  "/:id",
  async ({ params: { id } }) => {
    return TransfersService.getTransfers({ id });
  },
  {
    params: t.Object({
      id: t.Number(),
    }),
  },
);
