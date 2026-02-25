"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

export type GwType = {
  id: number;
  deadlinetime: string;
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
      const res = await fetch("/fpl/events.json");
      const events = (await res.json()) as GwType[];

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
