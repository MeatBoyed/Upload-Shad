import { SidebarNavItem } from "@/types/nav";

interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: "UploadShad - Getting started",
      items: [
        {
          title: "Overview",
          href: "/introduction",
          items: [],
        },
        {
          title: "Installation",
          href: "/installation",
          items: [],
        },
        {
          title: "ShadCN Forms Integration",
          href: "/uploadshad-shadcn-form-integration",
          items: [],
        },
      ],
    },
    {
      title: "UploadShad - Advanced Usage",
      items: [
        {
          title: "UploadShad",
          href: "/uploadshad/advanced-usage/uploadshad",
          items: [],
        },

        {
          title: "Files Previewer",
          href: "/uploadshad/advanced-usage/files-previewer",
          items: [],
        },
        {
          title: "State management",
          href: "/uploadshad/advanced-usage/state-management",
          items: [],
        },
        {
          title: "Customizing Styles",
          href: "/uploadshad/advanced-usage/customizing-styles",
          items: [],
        },
        {
          title: "Error Handling",
          href: "/uploadshad/advanced-usage/error-handling",
          items: [],
        },
      ],
    },
    {
      title: "Data Table - Getting Started",
      items: [
        {
          title: "Overview",
          href: "/datatable/data-table-overview",
          items: [],
        },
      ],
    },
    {
      title: "Nerf Designs X",
      items: [
        {
          title: "Branding Footer",
          href: "/ndx/branding-footer",
          items: [],
        },
        {
          title: "Calendly Dialog",
          href: "/ndx/calendly-dialog",
          items: [],
        },
        {
          title: "Data Table",
          items: [
            {
              title: "API Refernce",
              href: "/ndx/data-table-api-reference",
              items: [],
            },
          ],
        },
      ],
    },

    {
      title: "The Creator",
      items: [
        {
          title: "Author",
          href: "/charles-rossouw",
          items: [],
        },
        // {
        //   title: "More projects",
        //   href: "/faq/more-projects",
        //   items: [],
        // },
      ],
    },
  ],
};

// export const docsConfigOld: DocsConfig = {
//   sidebarNav: [
//     {
//       title: "Getting Started",
//       items: [
//         {
//           title: "Introduction",
//           href: "/",
//           items: [],
//         },
//       ],
//     },
//     {
//       title: "Core Concepts",
//       items: [
//         {
//           title: "API Reference",
//           href: "/api-reference",
//           items: [],
//         },
//         {
//           title: "Styling",
//           href: "/styling",
//           items: [],
//         },
//         {
//           title: "Variants",
//           href: "/variants",
//           items: [],
//         },
//         {
//           title: "Keyboard Interactions",
//           href: "/keyboard-interactions",
//           items: [],
//         },
//       ],
//     },
//     {
//       title: "Integrations",
//       items: [
//         {
//           title: "With React Hook Form",
//           href: "/integrations/react-hook-form",
//           items: [],
//         },
//         {
//           title: "With Shadcn Form",
//           href: "/integrations/shadcn-form",
//           items: [],
//         },
//       ],
//     },
//   ],
// };
