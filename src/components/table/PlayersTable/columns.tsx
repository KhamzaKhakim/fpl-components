"use client";

import { ColumnDef } from "@tanstack/react-table";

import { PlayerType } from "@/src/elysia/modules/players/model";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<PlayerType>[] = [
  {
    accessorKey: "webName",
    header: "Name",
    size: 140,
  },
  {
    accessorKey: "teamShortName",
    header: () => <div className="text-center">Team</div>,
    size: 80,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("teamShortName")}</div>
    ),
  },
  {
    accessorKey: "position",
    header: () => <div className="text-center">Position</div>,
    size: 80,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("position")}</div>
    ),
  },
  {
    accessorKey: "totalPoints",
    // header: () => <div className="text-center">Total Points</div>,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center gap-1">
          <p>Total Points</p>
          <Button
            size="icon-xxs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalPoints")}</div>
    ),
    size: 60,
  },
  {
    accessorKey: "nowCost",
    // header: () => <div className="text-center">Price</div>,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center gap-1">
          <p>Price</p>
          <Button
            size="icon-xxs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("nowCost"));

      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 1,
      }).format(cost / 10);

      return <div className="text-center font-medium">{formatted}</div>;
    },
    size: 80,
  },
];
