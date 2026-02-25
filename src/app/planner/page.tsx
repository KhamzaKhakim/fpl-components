"use client";

import { useQuery } from "@tanstack/react-query";

import Transfers from "@/src/components/Transfers";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";

export default function PlannerPage() {
  const user = useUser();

  const { data: response, isLoading } = useQuery({
    queryKey: ["squad", user.id],
    queryFn: () =>
      client
        .transfers({
          id: user.id!,
        })
        .get(),
    enabled: !!user.id,
  });

  // const { data: managerData, isLoading: managerDataLoading } = useQuery({
  //   queryKey: ["manager"],
  //   queryFn: () =>
  //     client
  //       .manager({
  //         id: user.id!,
  //       })
  //       .get(),
  //   enabled: !!user.id,
  // });

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
