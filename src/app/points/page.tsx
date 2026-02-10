"use client";

import Points from "@/src/components/Points";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
import { useQuery } from "@tanstack/react-query";

export default function PointsPage() {
  const user = useUser();

  const { data: response, isLoading } = useQuery({
    queryKey: ["points"],
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
      <Points
        size={600}
        data={response?.data}
        isLoading={!response || isLoading}
      />
    </div>
  );
}
