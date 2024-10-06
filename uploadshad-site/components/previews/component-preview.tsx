"use client";

import React, { useState, useMemo, useCallback } from "react";
import { cn, formatJavaScriptCode, uuid } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagInput, TagInputProps, Tag } from "emblor";
import CodeBlock from "./code-block";
import { UploadShad, UploadShadProps } from "@/registry/component/uploadshad";

// TODO: Update preivews from Doc code
// TODO: Fix Copy button not worki

interface ComponentPreviewProps
  extends Omit<TagInputProps, "tags" | "setTags" | "activeTagIndex" | "setActiveTagIndex"> {
  propName?: string;
  selectOptions?: Array<string>;
}

export function ComponentPreview({
  className,
  selectOptions,
  propName,
  ...otherProps
}: ComponentPreviewProps) {
  const defaultProps: UploadShadProps & {
    [key: string]: any;
  } = useMemo(() => {
    const props: UploadShadProps = {
      folderId: "uploadshad-site",
    };

    return props;
  }, []);

  const props: Partial<UploadShadProps> & {
    [key: string]: any;
  } = useMemo(() => {
    const props: Partial<UploadShadProps> = {
      ...otherProps,
    };
    return props;
  }, [otherProps]);

  const codeString = useMemo(() => {
    function serializeProp(value: any): string {
      if (typeof value === "function") {
        // Converts function to a string representation, removing possible function body clutter
        const funcString = value.toString().replace(/\{\s*\[native code\]\s*\}/g, "{}");
        // Optionally, trim the function to make it cleaner in display if needed
        return funcString;
      } else if (Array.isArray(value)) {
        // Serialize arrays to a more readable format
        return `[${value.map(serializeProp).join(", ")}]`;
      } else if (typeof value === "object" && value !== null) {
        // JSON stringify the object with indentation for readability
        return `{${Object.entries(value)
          .map(([key, val]) => `\n  ${key}: ${serializeProp(val)}`)
          .join(",\n")}\n}`;
      } else if (typeof value === "string") {
        // Return strings with proper quotes
        return `"${value.replace(/"/g, '\\"')}"`;
      } else {
        // Return other types directly, wrapping them in braces if they are not simple literals
        return `{${String(value)}}`;
      }
    }

    const propEntries = Object.entries(props)
      .map(([key, value]) => {
        return `${key}={${serializeProp(value)}}`;
      })
      .join("\n            ");

    const rawCodeString = `
        import React, { useState } from 'react';
        import { UploadShad, UploadShadProps } from "./uploadshad/main";

          const Example = () => {

              return (
                  <UploadShad
                    maxFiles={4}
                    maxSize{5 * 1024 * 1024}
                    customLoader={customerLoader}
                    defaultValues={initVehicle ? field.value : []}
                    handleChange: (uploadedImages, deletedImages) => {
                      // if (deletedImages) setValue("deletedImages", deletedImages); // Store deleted Images (only for existing form values)
                      // setValue("imagesOrder", uploadedImages.order); // Store File Order (only for existing form values)
                      // setValue("images", uploadedImages.newImages); // Stores Uploaded Files (Images)
                    }
                    ${propEntries}
                  />
              );
          };
          `;

    return formatJavaScriptCode(rawCodeString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherProps, propName]);

  return (
    <div className={cn("group relative my-4 flex flex-col space-y-2", className)} {...otherProps}>
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="relative rounded-md border p-5">
          <UploadShad {...defaultProps} {...props} />
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              <CodeBlock value={codeString as string} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
