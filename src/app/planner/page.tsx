"use-client";

import Transfers from "@/src/components/Transfers";
import { client } from "@/src/elysia/client";

export default async function PlannerPage() {
  const { data } = await client.api.teams({ id: "1712594" }).get();

  return (
    <div className="flex justify-center bg-cyan-200">
      <Transfers size={600} />
    </div>
  );
}
