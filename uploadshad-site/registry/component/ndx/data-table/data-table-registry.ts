import { Registry } from "@/registry/schema";

export const DataTableRegistry: Registry = [
  {
    name: "data-table",
    type: "registry:component",
    dependencies: ["@tanstack/react-table"],
    registryDependencies: [
      "table",
      "card",
      "skeleton",
      "card",
      "badge",
      "command",
      "popover",
      "separator",
      "input",
    ],
    files: [
      "component/ndx/data-table/data-table.tsx",
      "component/ndx/data-table/data-table-column-header.tsx",
      "component/ndx/data-table/data-table-facted-filter.tsx",
      "component/ndx/data-table/data-table-pagination.tsx",
      "component/ndx/data-table/data-table-row-actions.tsx",
      "component/ndx/data-table/data-table-tool-bar.tsx",
      "component/ndx/data-table/data-table-view-toggle.tsx",
    ],
  },
];
