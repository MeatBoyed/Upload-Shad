import React from "react";
import { FilesContextProvider } from "./hooks/files-context";
import { cn } from "@/lib/utils";

export interface UploadShadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  folderId?: string;
  defaultValues?: string[];
  handleChange?: (files: string[]) => void;
  metadata?: Record<string, string> | undefined;
}

export const UploadShad = React.forwardRef<HTMLInputElement, UploadShadProps>(
  (
    { className, type, defaultValues, children, folderId, metadata, handleChange, ...props },
    ref
  ) => {
    return (
      <FilesContextProvider
        folderId={folderId}
        metadata={metadata}
        defaultValues={defaultValues}
        onChange={handleChange}
      >
        <div
          className={cn("w-full flex justify-center items-center mr-10 gap-10 flex-col", className)}
        >
          {children}
        </div>
      </FilesContextProvider>
    );
  }
);
UploadShad.displayName = "ImagesInput";
