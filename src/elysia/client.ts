// elysia/client.ts

import { treaty } from "@elysiajs/eden";

import { TApp } from ".";

const url = process.env.URL_DOMAIN ?? "localhost:3000";
export const client = treaty<TApp>(url).api;
