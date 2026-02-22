import { getCurrentGameweekId } from "@/src/elysia/shared/store/eventsStore";
import { redirect } from "next/navigation";

export default function Page() {
  const gw = getCurrentGameweekId();
  redirect(`/points/${gw}`);
}
