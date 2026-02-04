"use client";

import Transfers from "@/src/components/Transfers";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

  console.log(JSON.stringify(response?.data));

  return (
    <div className="flex justify-center">
      <Transfers size={600} data={response?.data} isLoading={isLoading} />
    </div>
  );
}
