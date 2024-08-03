"use client";

import * as React from "react";
import Image from "next/image";
import Dropzone, { type DropzoneProps, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { cn, formatBytes } from "./FileInputUtils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadIcon, X } from "lucide-react";
import { useContext } from "react";
import { UploadContext, UploadContextType } from "./hooks/uploadContext";
import { useControllableState } from "./hooks/useControllableState";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[];

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;

  // /**
  //  * Function to be called when files are uploaded.
  //  * @type (files: File[]) => Promise<void>
  //  * @default undefined
  //  * @example onUpload={(files) => uploadFiles(files)}
  //  */
  // onUpload?: (files: File[]) => Promise<void>;
  // onUpload?: (files: File[]) => Promise<{ files: File[]}>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps["maxFiles"];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
}

const FileUploader = React.forwardRef<HTMLInputElement, FileUploaderProps>((props, ref) => {
  const {
    value: valueProp,
    onValueChange,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  // Upload Context state
  const { uploadedImages, handleUpload } = useContext(UploadContext) as UploadContextType;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Manage Component's Validation
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error("Ooops, you can't do that.", {
          description: "Cannot upload more than 1 file at a time",
          duration: 10000,
        });
        return;
      }

      console.log("Totoal Input length", uploadedImages?.length || 0 + acceptedFiles.length);
      if ((uploadedImages?.length ?? 0) + acceptedFiles.length > maxFiles) {
        console.log("Hello youu");
        toast.error("Oops, you can't do that.", {
          description: `Cannot upload more than ${maxFiles} files`,
          duration: 10000,
        });
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      // Manage Specific File Validation requirements
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors, file }) => {
          errors.forEach((error) => {
            switch (error.code) {
              case "file-too-large":
                toast.error(`Oh no! Images bigger than ${formatBytes(maxSize)} are not allowed.`, {
                  description: `File ${file.name} was rejected.`,
                  duration: 10000,
                });
                break;
              case "file-invalid-type":
                toast.error(`Oh no! ${file.type} are not allowed.`, {
                  description: `File ${file.name} was rejected.`,
                  duration: 10000,
                });
                break;
              default:
                toast.error("Oops, something happened.", {
                  description: `File ${file.name} was rejected.`,
                  duration: 10000,
                });
            }
          });
        });
      }

      if (updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
        const target = updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        toast.promise(handleUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },

    [files, maxFiles, maxSize, multiple, handleUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (uploadedImages?.length ?? 0) >= maxFiles;

  return (
    <div className="relative flex flex-col w-full gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50",
              isDisabled && "pointer-events-none opacity-60",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon className="size-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="font-medium text-muted-foreground">Drop the files here</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon className="size-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex justify-center items-center gap-3 flex-col">
                  <p className="font-medium text-muted-foreground">Drag {`'n'`} drop files here, or click to select files</p>
                  <p className="text-sm text-muted-foreground/70">
                    You can upload
                    {maxFiles > 1
                      ? ` ${maxFiles === Infinity ? "multiple" : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                      : ` a file with ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files?.map((file, index) => (
              <FileCard key={index} file={file} onRemove={() => onRemove(index)} progress={progresses?.[file.name]} />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
});
FileUploader.displayName = "FileUploader";

export { FileUploader };

interface FileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  file: File;
  onRemove: () => void;
  progress?: number;
}

const FileCard = React.forwardRef<HTMLDivElement, FileCardProps>(({ className, file, onRemove, progress, ...props }, ref) => {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" className="size-7" onClick={onRemove}>
          <X className="size-4 " aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
});
FileCard.displayName = "FileCard";

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}
