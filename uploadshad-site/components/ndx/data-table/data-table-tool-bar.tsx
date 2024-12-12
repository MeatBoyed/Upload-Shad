"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "./data-table-facted-filter";
import { DataTableViewOptions } from "./data-table-view-toggle";
import { Statuses } from "./data-table-columns-example";

/**
 * Props for the `DataTableToolbar` component.
 * @template TData - The type of data in the table.
 * @param {Table<TData>} table - The TanStack Table instance.
 * @param {string} [searchColumn] - The name of the column to search.  If not provided, no search bar is rendered.
 * @param {Array<{ column: string; title: string; options: Array<{ label: string; value: string }> }>} [filters] - An array of filter objects. Each object defines a filter with a column name, title, and an array of options. If not provided, no filters are rendered.
 */
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  filters?: Filter[];
}

export interface Filter {
  column: string;
  title: string;
  options: Array<{ label: string; value: string }>;
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchColumn && (
          <Input
            placeholder={`Search ${searchColumn} ...`}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Render out Provided filters */}
        {filters &&
          filters.map(
            (filter, index) =>
              table.getColumn(filter.column) && (
                <DataTableFacetedFilter
                  key={index}
                  column={table.getColumn(filter.column)}
                  title={filter.title}
                  options={filter.options}
                />
              )
          )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
