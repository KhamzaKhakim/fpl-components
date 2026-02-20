import { t } from "elysia";

export const teamBody = t.Object({
  id: t.Number(),
  code: t.Number(),
  name: t.String(),
  shortName: t.String(),
  strength: t.Number(),
  position: t.Number(),
});

export type TeamType = typeof teamBody.static;

export const chip = t.UnionEnum(["wildcard", "freehit", "bboost", "3xc"]);

export type ChipType = typeof chip.static;
