"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import store from "store2";

export type UserType = {
  id: string | null;
  setId: (id: string | null) => void;
};
export const UserContext = createContext<UserType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const stored = store.get("id");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setId(stored);
  }, []);

  return (
    <UserContext.Provider value={{ id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
