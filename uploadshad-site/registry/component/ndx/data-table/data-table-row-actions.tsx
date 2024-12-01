"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { z, ZodSchema } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  // table: DatabaseTables
  table: "application";
  schema: ZodSchema<any>;
}

export function DataTableRowActions<TData>({
  row,
  table,
  schema,
}: DataTableRowActionsProps<TData>) {
  const rowData = row.original;
  const router = useRouter();
  // const application = ValidateApplication(rowData, table)
  console.log("Tables: ", table);
  // Mutation query
  // const { mutate } = useUpdateApplication<z.infer<typeof schema>>()

  function handleStatusChange(newStatus: string) {
    // if (!application) return;
    toast.promise(
      async () => {
        // if (!application?.app?.id) {
        //   throw new Error("Application ID is missing");
        // }
        // mutate({
        //   id: application.app.id.toString(),
        //   newStatus: newStatus,
        //   tableName: table,
        // })
      },
      {
        loading: "Updating application's status",
        success: (res) => {
          console.log("Response: ", res);
          location.reload();
          return "Status successfully updated!";
        },
        error: (error: Error) => {
          console.log("Error: ", error);
          return error.message || "Oops 🤯 An unexpected error ocurred!";
        },
      }
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuRadioGroup
        // value={application?.app.status || "Send For Validation"}
        >
          {/* {statuses.map((label) => (
            <DropdownMenuRadioItem
              key={label.value}
              value={label.value}
              onClick={() => handleStatusChange(label.value)}
            >
              {label.label}
            </DropdownMenuRadioItem>
          ))} */}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// export function DataTableRowPayAction<TData>({
//   row,
//   table,
//   schema,
// }: DataTableRowActionsProps<TData>) {
//   const rowData = row.original
//   const application = ValidateApplication(rowData, table)
//   // console.log("Tables: ", table)

//   return (
//     <Link
//       className={buttonVariants({})}
//       href={`${siteMapData.Dashboard.children.Payment.path}?table=${table}&application=${application?.app.id}`}
//     >
//       Pay Now
//     </Link>
//   )
// }

// type availbleApplications =
//   | BursaryApplication
//   | DriversLicenseApplication
//   | PassportApplication
//   | VaccinationApplication
// interface ValidateApplicationResponse {
//   app: availbleApplications
//   tableName: DatabaseTables
// }
// function ValidateApplication(
//   application: any,
//   table: DatabaseTables
// ): ValidateApplicationResponse | undefined {
//   if (table == "bursary_applications") {
//     const {
//       data: bursaryApplication,
//       error: bursaryError,
//       success,
//     } = BursaryApplicationSchema.safeParse(application)
//     if (success) {
//       console.log("Bursary ", bursaryApplication)
//       return {
//         app: bursaryApplication,
//         tableName: "bursary_applications",
//       }
//     }
//   }
//   if (table === "drivers_license_applications") {
//     const {
//       data: driversApplication,
//       error: driversError,
//       success,
//     } = DriversLicenseSchema.safeParse(application)
//     if (success) {
//       console.log("Drivers ", driversApplication)
//       return {
//         app: driversApplication,
//         tableName: "drivers_license_applications",
//       }
//     }
//   }
//   if (table === "passport_applications") {
//     const {
//       data: passportApplication,
//       error: passportError,
//       success,
//     } = PassportApplicationSchema.safeParse(application)
//     console.log("Passport: ", passportError)
//     if (success) {
//       console.log("Passport ", passportApplication)
//       return {
//         app: passportApplication,
//         tableName: "passport_applications",
//       }
//     }
//   }
//   if (table === "vaccination_applications") {
//     const {
//       data: vaccinationApplication,
//       error: vaccinationError,
//       success,
//     } = VaccinationApplicationSchema.safeParse(application)
//     if (success) {
//       console.log("Vaccination: ", vaccinationApplication)
//       return {
//         app: vaccinationApplication,
//         tableName: "vaccination_applications",
//       }
//     }
//   }
// }
