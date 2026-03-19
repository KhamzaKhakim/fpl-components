"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";

import { PlayerType } from "@/src/elysia/modules/players/model";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

import { remove } from "diacritics";

const costRangeFilter: FilterFn<PlayerType> = (
  row,
  columnId,
  value: [number, number],
) => {
  const cost = row.getValue<number>(columnId);
  const [min, max] = value;

  if (min && cost / 10 < Number(min)) return false;
  if (max && cost / 10 > Number(max)) return false;
  return true;
};

const nameFilter: FilterFn<PlayerType> = (row, columnId, value: string) => {
  const normalize = (str: string) => remove(str).toLowerCase();

  const name = row.getValue<string>(columnId);
  if (normalize(name).includes(normalize(value))) {
    console.log(normalize(name));
  }

  return normalize(name).includes(normalize(value));
};

export const columns: ColumnDef<PlayerType>[] = [
  {
    accessorKey: "webName",
    header: "Name",
    size: 140,
    filterFn: nameFilter,
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
    sortDescFirst: true,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center gap-1">
          <p>Total Points</p>
          <Button
            size="icon-xxs"
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() !== "desc")
            }
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
    sortDescFirst: true,
    filterFn: costRangeFilter,
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center gap-1">
          <p>Price</p>
          <Button
            size="icon-xxs"
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() !== "desc")
            }
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
