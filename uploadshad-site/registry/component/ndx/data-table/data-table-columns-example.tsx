"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  CheckIcon,
  Circle,
  CircleOff,
  DownloadCloudIcon,
  HelpCircle,
  Timer,
  XCircleIcon,
} from "lucide-react";

import { DataTableColumnHeader } from "@/registry/component/ndx/data-table/data-table-column-header";
import { DataTableRowActions } from "@/registry/component/ndx/data-table/data-table-row-actions";

export enum Status {
  InProgress = "In Progress",
  Validating = "Validating",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface UserEntity {
  name: string;
  surname: string;
  gender: string;
  email: string;
  date_of_birth: string;
  phone_number: string;
  status: string;
  created_at: string;
}

export const UserColumns: ColumnDef<UserEntity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "surname",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Surname" />,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => <DataTableColumnHeader column={column} title="DoB" />,
    cell: ({ row }) => {
      return FormatDateRow(row.getValue("created_at"));
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return FormatStatusRow(row.getValue("status"));
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applied at" />,
    cell: ({ row }) => {
      return FormatDateRow(row.getValue("created_at"));
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DataTableRowActions
        // table="b`ursary_applications"
        row={row}
      />
    ),
  },
];

// Templated Values for a Status field
// This should be a forced Enum on the field, which is also enforced in the backend
export const Statuses: { value: Status; label: string; icon: any }[] = [
  {
    value: Status.Validating,
    label: "Validating",
    icon: Circle,
  },
  {
    value: Status.InProgress,
    label: "In Progress",
    icon: Timer,
  },
  {
    value: Status.Approved,
    label: "Approved",
    icon: CheckCircle,
  },
  {
    value: Status.Rejected,
    label: "Rejected",
    icon: CircleOff,
  },
];

// Formats a DateTime field
export function FormatDateRow(value: unknown) {
  const date = new Date(value as string);
  return date.toLocaleDateString();
}

// Handles Displaying Download link for a document/image Row
export function VerifyDocumentIsUploaded(document: unknown) {
  return (
    <div className="flex items-center justify-center">
      {document === null && <XCircleIcon className="hover text-destructive" />}
      {typeof document === "string" && (
        <Link href={document}>
          <DownloadCloudIcon className="text-green-400" />
        </Link>
      )}
    </div>
  );
}

// Formats and shows Respective Icon/colour for a Status row
export function FormatStatusRow(value: unknown) {
  const status = Statuses.find((status) => status.value === value);

  if (!status) {
    return null;
  }

  return (
    <div className="flex w-[100px] items-center">
      {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
      <span>{status.label}</span>
    </div>
  );
}
