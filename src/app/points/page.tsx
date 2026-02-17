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

  const [gameweek, setGameweek] = useState<number | null>(gw?.id ?? null);

  useEffect(() => {
    if (gw != null) {
      setGameweek(gw.id);
    }
  }, [gw]);

  const { data: response, isLoading } = useQuery({
    queryKey: ["live", gameweek],
    queryFn: () =>
      client
        .live({
          id: userId!,
        })
        .points({
          gw: gameweek!,
        })
        .get(),
    enabled: !!userId && !!gameweek,
  });

  return (
    <div className="flex justify-center">
      <Points
        size={600}
        gameweek={gameweek}
        setGameweek={setGameweek}
        currGameweek={gw?.id}
        // TODO: fix this part
        data={response?.data}
        isLoading={!response || isLoading}
      />
    </div>
  );
}
