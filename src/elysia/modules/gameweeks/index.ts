import { Elysia } from "elysia";
import { getAllGameweeks } from "./service";

export const gameweeks = new Elysia({ prefix: "/gameweeks" }).get("/", () =>
  getAllGameweeks(),
);
