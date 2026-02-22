"use client";

import Points from "@/src/components/Points";
import { useGameweek } from "@/src/context/gameweek/useGameweek";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const router = useRouter();

  const { id: gameweek } = use(params);

  const { id: userId } = useUser();
  const { gw } = useGameweek();

  const changeGameweek = (newGw: number) => {
    router.push(`/points/${newGw}`);
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ["live", gameweek],
    queryFn: () =>
      client
        .live({
          id: userId!,
        })
        .points({
          gw: +gameweek || gw?.id!,
        })
        .get(),
    enabled: !!userId && !!gameweek,
  });

  return (
    <div className="flex justify-center">
      <Points
        size={600}
        gameweek={+gameweek}
        setGameweek={changeGameweek}
        currGameweek={gw?.id}
        // TODO: fix this part
        data={response?.data}
        isLoading={!response || isLoading}
      />
    </div>
  );
}
