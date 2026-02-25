export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getCurrentGameweekId } from "@/src/elysia/modules/gameweeks/cache";

//TODO: find better way get current gw
export default async function Page() {
  const gw = await getCurrentGameweekId();
  redirect(`/points/${gw}`);
}
