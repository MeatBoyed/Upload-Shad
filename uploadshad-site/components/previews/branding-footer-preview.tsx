"use client";

import React from "react";
import { cn } from "@/lib/utils";
import BrandingFooter from "../ndx/branding-footer";

interface ComponentPreviewProps {
  className?: string;
  propName?: string;
  selectOptions?: Array<string>;
}

export function BrandingFooterPreview({
  className,
  selectOptions,
  propName,
  ...otherProps
}: ComponentPreviewProps) {
  return (
    <div className={cn("group relative my-4 flex flex-col space-y-2", className)} {...otherProps}>
      <div className="relative rounded-md border p-5">
        <BrandingFooter />
      </div>
    </div>
  );
}
