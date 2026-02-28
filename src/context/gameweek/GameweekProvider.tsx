"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import { getAllGameweeks } from "@/src/elysia/modules/gameweeks/cache";

export type GwType = {
  id: number;
  deadlineTime: string;
  deadlineTimeEpoch: number;
  name: string;
  isCurrent: boolean;
};

export type GwContextType = {
  gw: GwType | null;
};

export const GameweekContext = createContext<GwContextType | null>(null);

export function GameweekProvider({ children }: { children: ReactNode }) {
  const [gw, setGw] = useState<GwType | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/gameweeks");
      const events: GwType[] = await res.json();

      const current = events.find((e) => e.isCurrent) ?? null;
      setGw(current);
    };

    load();
  }, []);

  return (
    <GameweekContext.Provider value={{ gw }}>
      {children}
    </GameweekContext.Provider>
  );
}
