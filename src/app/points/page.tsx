import { redirect } from "next/navigation";
import { use } from "react";

import { useGameweek } from "@/src/context/gameweek/useGameweek";

export default function Page() {
  const gw = use(useGameweek());
  redirect(`/points/${gw}`);
}
