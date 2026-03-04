"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronRightIcon,
  CirclePlus,
  SquarePen,
  Trash2Icon,
} from "lucide-react";

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
import Transfers from "@/src/components/Transfers";
import { useUser } from "@/src/context/user/useUser";
import { client } from "@/src/elysia/client";
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

  const tempItems = [
    {
      name: "in: Wirtz, Salah & out: Jones, Gakpo",
      valid: true,
    },
    {
      name: "in: Wilson, Dango & out: Haaland, Alisson",
      valid: false,
    },
  ];

  // const { data: managerData, isLoading: managerDataLoading } = useQuery({
  //   queryKey: ["manager"],
  //   queryFn: () =>
  //     client
  //       .manager({
  //         id: user.id!,
  //       })
  //       .get(),
  //   enabled: !!user.id,
  // });

  return (
    <div className="mx-16 my-4">
      <div className="flex justify-center">
        <div>
          <div className="flex flex-col px-8 gap-2">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Plans:</h1>
              <Button size="sm">
                <CirclePlus /> Add plan
              </Button>
            </div>
            {tempItems.map((i) => (
              <Item variant="outline" size="sm" key={i.name}>
                <ItemMedia>
                  <CalendarDays className="size-4" />
                  <p className="text-xxs font-bold">GW 16-24</p>
                </ItemMedia>
                <div className="h-8">
                  <Separator orientation="vertical" />
                </div>
                <ItemContent>
                  <ItemTitle>
                    {i.name}
                    {!i.valid && <Badge variant="destructive">invalid</Badge>}
                  </ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button type="button" variant="ghost" size="icon-sm">
                    <Trash2Icon className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm">
                    <SquarePen className="size-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm">
                    <ChevronRightIcon className="size-4" />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
          <Transfers
            size={SIZE}
            data={response?.data}
            isLoading={!response || isLoading}
          />
        </div>
      </div>
    </div>
  );
}
