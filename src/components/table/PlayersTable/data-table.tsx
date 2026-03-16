"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  // ① The scrollable element the virtualizer observes
  const scrollRef = useRef<HTMLDivElement>(null);

  // ② Set up the row virtualizer
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 10, // rows rendered beyond the visible area (buffer)
  });

  const virtualRows = virtualizer.getVirtualItems();
  // Total height of all rows — keeps the scrollbar accurate
  const totalSize = virtualizer.getTotalSize();

  return (
    // ③ Fixed-height, scrollable wrapper
    <div
      ref={scrollRef}
      className="overflow-auto rounded-md border"
      style={{ height: tableHeight }}
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
          {rows.length ? (
            <>
              {/* ④ Spacer row — pushes virtual rows to the correct scroll position */}
              {virtualRows[0]?.start > 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    style={{ height: virtualRows[0].start, padding: 0 }}
                  />
                </TableRow>
              )}

              {/* ⑤ Only the visible rows are rendered */}
              {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement} // lets the virtualizer measure real heights
                    data-state={row.getIsSelected() && "selected"}
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

              {/* ⑥ Bottom spacer — fills the remaining scroll height */}
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
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
