import { redirect } from "next/navigation";
import { use } from "react";

import { getCurrentGameweekId } from "@/src/elysia/modules/gameweeks/cache";

export default function Page() {
  const gw = use(getCurrentGameweekId());
  redirect(`/points/${gw}`);
}
