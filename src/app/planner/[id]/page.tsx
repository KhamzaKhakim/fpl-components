"use client";

import { useQuery } from "@tanstack/react-query";

import Transfers from "@/src/components/TransferField";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
export default function PlannerPage() {
  const user = useUser();
  const SIZE = 600;

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
    <div className="mx-16 my-4">
      <div className="flex justify-center">
        <div>
          <Transfers
            size={SIZE}
            data={response?.data}
            isLoading={!response || isLoading}
          />
        </div>
      </div>
    </div>
  );
}
