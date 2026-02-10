"use client";

import Transfers from "@/src/components/Transfers";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
import { useQuery } from "@tanstack/react-query";

export default function PlannerPage() {
  const user = useUser();

  const { data: response, isLoading } = useQuery({
    queryKey: ["squad"],
    queryFn: () =>
      client
        .teams({
          id: user.id!,
        })
        .get(),
    enabled: !!user.id,
  });

  return (
    <div className="flex justify-center">
      <Transfers
        size={600}
        data={response?.data}
        isLoading={!response || isLoading}
      />
    </div>
  );
}
