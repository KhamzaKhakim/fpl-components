import { redirect } from "next/navigation";

import { getCurrentGameweekId } from "@/src/elysia/shared/store/eventsStore";

export default function Page() {
  const gw = getCurrentGameweekId();
  redirect(`/points/${gw}`);
}
