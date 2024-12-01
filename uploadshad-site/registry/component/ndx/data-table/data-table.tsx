"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { AlertTriangleIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "@/registry/component/ndx/data-table/data-table-pagination";
import { DataTableToolbar } from "@/registry/component/ndx/data-table/data-table-tool-bar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultColumnVisibility?: VisibilityState;
}

export default function ModelTable<TData, TValue>({
  columns,
  data,
  defaultColumnVisibility,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    defaultColumnVisibility || {}
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4 pb-3 ">
      <DataTableToolbar table={table} />
      <div className="space-y-8 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

export function ModelTableSkeleton() {
  return (
    <Card>
      <Skeleton className="min-h-[400px] min-w-[320px] rounded-md" />
    </Card>
  );
}
export function ModelTableError({ error }: { error: Error }) {
  return (
    <Card className="flex w-full min-w-[320px] flex-col items-center justify-center px-3 py-4 text-center">
      <AlertTriangleIcon size={60} />
      <CardHeader>
        <CardTitle>
          Ooops 🤯 <br /> Something happened!
        </CardTitle>
        <CardDescription>
          {error.message + "." || "Something unexpected happened. Please check the logs"}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
