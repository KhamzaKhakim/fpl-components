"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserType = {
  id: string | null;
  setId: (id: string | null) => void;
};
export const UserContext = createContext<UserType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setId(id);
    }
  }, []);

  return (
    <UserContext.Provider value={{ id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
