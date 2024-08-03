import { SidebarNavItem } from "@/types/nav";

interface DocsConfig {
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: "Getting started",
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
          title: "State management",
          href: "/state-management",
          items: [],
        },
        {
          title: "Uploading Files to the Cloud",
          href: "/uploading-files-to-cloud",
          items: [],
        },
      ],
    },
    {
      title: "Advanced Usage",
      items: [
        {
          title: "UploadShad",
          href: "/advanced-usage/uploadshad",
          items: [],
        },
        // {
        //   title: "FileInput",
        //   href: "/components/images-input",
        //   items: [],
        // },
        // {
        //   title: "UploadedFilesCard",
        //   href: "/components/uploaded-files-card",
        //   items: [],
        // },
        {
          title: "Custom Image Loader",
          href: "/advanced-usage/custom-image-loader",
          items: [],
        },
        {
          title: "Customizing Styles",
          href: "/advanced-usage/customizing-styles",
          items: [],
        },
        {
          title: "Handling Errors",
          href: "/advanced-usage/handling-errors",
          items: [],
        },
      ],
    },
    {
      title: "Integrations",
      items: [
        {
          title: "With Shadcn Form",
          href: "/integrations/shadcn-form",
          items: [],
        },
        {
          title: "With React Hook Form",
          href: "/integrations/react-hook-form",
          items: [],
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
