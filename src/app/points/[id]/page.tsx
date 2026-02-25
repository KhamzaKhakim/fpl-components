"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";

import Points from "@/src/components/Points";
import { useGameweek } from "@/src/context/gameweek/useGameweek";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const router = useRouter();

  const { id: gameweek } = use(params);

  const { id: userId } = useUser();

  const { gw } = useGameweek();

  if (isNaN(+gameweek) || +gameweek < 1 || +gameweek > (gw?.id || 38)) {
    notFound();
  }

  const changeGameweek = (newGw: number) => {
    router.push(`/points/${newGw}`);
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ["live", gameweek, userId],
    queryFn: () =>
      client
        .live({
          id: userId!,
        })
        .points({
          gw: Number(gameweek),
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
