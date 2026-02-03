"use client";

import Transfers from "@/src/components/Transfers";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
import { useEffect, useState } from "react";

export default function PlannerPage() {
  const user = useUser();

  // console.log(JSON.stringify(a));

  return (
    <div className="flex justify-center">
      <Transfers size={600} />
    </div>
  );
}
