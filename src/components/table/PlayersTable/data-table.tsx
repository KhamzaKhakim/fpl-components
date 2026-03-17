"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { notUndefined, useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/src/elysia/client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowHeight?: number; // estimated row height in px
  tableHeight?: number; // scrollable container height in px
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowHeight = 48,
  tableHeight = 500,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [team, setTeam] = useState<string>("");
  const [position, setPosition] = useState<string>("");

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data, error } = await client.teams.get();

      if (error) throw error;

      return data;
    },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const { rows } = table.getRowModel();

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 0, // rows rendered beyond the visible area (buffer)
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const [before, after] =
    virtualRows.length > 0
      ? [
          notUndefined(virtualRows[0]).start - virtualizer.options.scrollMargin,
          virtualizer.getTotalSize() -
            notUndefined(virtualRows[virtualRows.length - 1]).end,
        ]
      : [0, 0];

  const handleTeamFilterChange = (value: string) => {
    setTeam(value);
    table.getColumn("teamShortName")?.setFilterValue(value || undefined);
    virtualizer.scrollToIndex(0);
  };

  const handlePositionFilterChange = (value: string) => {
    setPosition(value);
    table.getColumn("position")?.setFilterValue(value || undefined);
    virtualizer.scrollToIndex(0);
  };

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        {/* TODO: fix Odeegard case */}
        <Input
          className="flex-2"
          placeholder="Search by name..."
          value={(table.getColumn("webName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("webName")?.setFilterValue(event.target.value)
          }
        />

        <div className="flex-1">
          <Select value={team} onValueChange={handleTeamFilterChange}>
            <SelectTrigger
              className="w-full"
              value={team}
              onReset={() => handleTeamFilterChange("")}
            >
              <SelectValue placeholder="Team" defaultValue={team} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {teams?.map((t) => (
                  <SelectItem value={t.shortName} key={t.id}>
                    {t.shortName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="py-4">
        <ToggleGroup
          type="single"
          variant="outline"
          className="w-full"
          value={position}
          onValueChange={handlePositionFilterChange}
        >
          <ToggleGroupItem value="GK" className="flex-1">
            GK
          </ToggleGroupItem>
          <ToggleGroupItem value="DEF" className="flex-1">
            DEF
          </ToggleGroupItem>
          <ToggleGroupItem value="MID" className="flex-1">
            MID
          </ToggleGroupItem>
          <ToggleGroupItem value="FWD" className="flex-1">
            FWD
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div
        ref={scrollRef}
        className="overflow-auto rounded-md border px-4"
        style={{ height: tableHeight }}
      >
        <Table noWrapper>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-background"
                    style={{
                      width: header.getSize(),
                      position: "sticky",
                      top: 0,
                      boxShadow: "inset 0 -1px 0 var(--border)",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {before > 0 && (
              <tr>
                <td colSpan={columns.length} style={{ height: before }} />
              </tr>
            )}
            {rows.length ? (
              <>
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <TableRow
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                      data-state={row.getIsSelected() && "selected"}
                      style={{
                        height: `${virtualRow.size}px`,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}

                {virtualRows.length > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      style={{
                        height:
                          totalSize -
                          (virtualRows[virtualRows.length - 1]?.end ?? 0),
                        padding: 0,
                      }}
                    />
                  </TableRow>
                )}
                {after > 0 && (
                  <tr>
                    <td colSpan={columns.length} style={{ height: after }} />
                  </tr>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
