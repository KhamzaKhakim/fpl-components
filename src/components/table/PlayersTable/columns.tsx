"use client";

import { ColumnDef } from "@tanstack/react-table";

import { PlayerType } from "@/src/elysia/modules/players/model";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<PlayerType>[] = [
  {
    accessorKey: "webName",
    header: "Name",
  },
  {
    accessorKey: "team",
    header: "Team",
  },
  {
    accessorKey: "totalPoints",
    header: "Total Points",
  },
  {
    accessorKey: "nowCost",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("nowCost"));

      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 1,
      }).format(cost / 10);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
