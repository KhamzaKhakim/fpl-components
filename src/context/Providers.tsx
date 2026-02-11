"use client"; // Mark this as a Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { UserProvider } from "./user/UserProvider";
import { GameweekProvider } from "./gameweek/GameweekProvider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <GameweekProvider>{children}</GameweekProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
