import { Registry } from "./schema";

export const uploadshadRegistry: Registry = [
  // {
  //   name: "uploadshad",
  //   type: "registry:block",
  // registryDependencies: [],
  //   dependencies: [
  //     "zod",
  //     "uuid",
  //     "sonner",
  //     "react-dropzone",
  //     "@hello-pangea/dnd",
  //     "@aws-sdk/client-s3",
  //     "@aws-sdk/s3-request-presigner",
  //   ],
  //   devDependencies: ["@types/uuid"],
  //   files: [
  //     "uploadshad/hooks/files-context.tsx",
  //     "uploadshad/hooks/controlled-state.ts",
  //     "uploadshad/hooks/controller-layer.ts",
  //     "uploadshad/utils/s3service.ts",
  //     "uploadshad/utils/uploadshad-secrets.ts",
  //     "uploadshad/utils/uploadshad-utils.ts",
  //     "uploadshad/actions.ts",
  //     "uploadshad/emptycard.tsx",
  //     "uploadshad/file-input.tsx",
  //     "uploadshad/files-preview.tsx",
  //     "uploadshad/uploadshad.tsx",
  //   ],
  // },
  {
    name: "uploadshad",
    type: "registry:component",
    registryDependencies: [
      "card",
      "button",
      "scroll-area",
      "aspect-ratio",
      "http://localhost:3000/registry/uploadshad-hooks.json",
      "http://localhost:3000/registry/uploadshad-utils.json",
      "http://localhost:3000/registry/uploadshad-api.json",
    ],
    dependencies: [
      "zod",
      "uuid",
      "sonner",
      "react-dropzone",
      "@hello-pangea/dnd",
      "@aws-sdk/client-s3",
      "@aws-sdk/s3-request-presigner",
    ],
    devDependencies: ["@types/uuid"],
    files: [
      "component/uploadshad/uploadshad.tsx",
      "component/uploadshad/files-preview.tsx",
      "component/uploadshad/emptycard.tsx",
      "component/uploadshad/file-input.tsx",
      "component/uploadshad/actions.ts",
      "component/uploadshad/index.ts",
    ],
  },
];

export const uploadShadAccessories: Registry = [
  {
    name: "uploadshad-hooks",
    type: "registry:hook",
    files: [
      "component/uploadshad/hooks/index.ts",
      "component/uploadshad/hooks/files-context.tsx",
      "component/uploadshad/hooks/controlled-state.ts",
      "component/uploadshad/hooks/controller-layer.ts",
    ],
  },
  {
    name: "uploadshad-utils",
    type: "registry:lib",
    files: [
      "component/uploadshad/utils/index.ts",
      "component/uploadshad/utils/s3service.ts",
      "component/uploadshad/utils/secrets.ts",
      "component/uploadshad/utils/utils.ts",
    ],
  },
  {
    name: "uploadshad-api",
    type: "registry:lib",
    files: ["component/uploadshad/route.ts"],
  },
];
