"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronRightIcon,
  CirclePlus,
  SquarePen,
  Trash2Icon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import store from "store2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import PlannerField from "@/src/components/fields/PlannerField";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
import { TransfersResponse } from "@/src/elysia/modules/transfers/model";

import { PlanType } from "./types";
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

  return (
    <div className="mx-16 my-4">
      <div className="flex justify-center">
        <div>
          <PlannerField
            size={SIZE}
            data={response?.data}
            isLoading={!response || isLoading}
            // canDrag={false}
          />
        </div>
        {response?.data && <Plans response={response?.data} />}
      </div>
    </div>
  );
}

function Plans({ response }: { response: TransfersResponse }) {
  const [plans, setPlans] = useState<PlanType[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlans(() => store.get("plans"));
  }, []);

  function createPlan() {
    const plans = store.get("plans") as PlanType[];
    const lastPlan = plans[plans.length - 1];
    const nextId = lastPlan ? lastPlan.id + 1 : 1;

    store.set(`plans.${nextId}`, [response]);

    //TODO: should work on naming. Want to use AI or something like that to create a name automatically.
    store.set(`plans`, [
      ...plans,
      {
        id: nextId,
        startGw: response.gw,
        endGw: response.gw,
        name: "Bla",
        valid: true,
      },
    ] satisfies PlanType[]);

    redirect(`/planner/${nextId}`);
  }

  return (
    <div className="flex flex-col px-8 gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Plans:</h1>
        <Button size="sm" onClick={createPlan}>
          <CirclePlus />
          New plan
        </Button>
      </div>
      {plans?.map((plan) => (
        <Item variant="outline" size="xs" key={plan.id}>
          <ItemMedia>
            <CalendarDays className="size-4" />
            <p className="text-xxs font-bold">
              GW {plan.startGw}-{plan.endGw}
            </p>
          </ItemMedia>
          <div className="h-8">
            <Separator orientation="vertical" />
          </div>
          <ItemContent>
            <ItemTitle>
              {plan.name}
              {!plan.valid && <Badge variant="destructive">invalid</Badge>}
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button type="button" variant="ghost" size="icon-xs">
              <Trash2Icon className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon-xs">
              <SquarePen className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => redirect(`/planner/${plan.id}`)}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}
