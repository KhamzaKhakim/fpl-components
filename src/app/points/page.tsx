"use client";

import Points from "@/src/components/Points";
import { useGameweek } from "@/src/context/gameweek/useGameweek";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function PointsPage() {
  const { id: userId } = useUser();
  const { gw } = useGameweek();

  const { data: response, isLoading } = useQuery({
    queryKey: ["points", gw],
    queryFn: () =>
      client
        .teams({
          id: userId!,
        })
        .points({
          gw: gw?.id!,
        })
        .get(),
    enabled: !!userId && !!gw?.id,
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
