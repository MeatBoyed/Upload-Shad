import { FileUploader } from "./FileUploader";
import { cn } from "./FileInputUtils";
import React from "react";
import { UploadContextProvider } from "./hooks/uploadContext";
import { UploadedFiles } from "./UploadedFiles";

/**
 * Interface for the UploadShad component props.
 * Extends the InputHTMLAttributes of React, adding additional properties.
 */
interface UploadShadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * An array of default values for the input.
   * The type of the values is string.
   */
  defaultValues?: string[];

  /**
   * The maximum number of files that can be uploaded.
   */
  maxFiles: number;

  /**
   * The maximum size of the files that can be uploaded, in bytes.
   */
  maxSize: number;

  /**
   * A function that is called when the files are changed.
   * It takes an object with two properties:
   * - newImages: An array of File objects representing the newly uploaded images.
   * - order: An array of strings representing the order of the images.
   * It can also take two optional parameters:
   * - deletedImages: An array of strings representing the deleted images.
   * - newImages: An array of File objects representing the newly uploaded images.
   * The function should return void.
   */
  handleChange: (uploadedImages: { newImages: File[]; order: string[] }, deletedImages?: string[], newImages?: File[]) => void;

  /**
   * An optional function that returns a string to be used as a custom loader.
   */
  customLoader?: () => string;
}

const UploadShad = React.forwardRef<HTMLInputElement, UploadShadProps>(
  ({ className, type, defaultValues, handleChange, maxFiles, maxSize, customLoader, ...props }, ref) => {
    return (
      <UploadContextProvider defaultImages={defaultValues} handleChange={handleChange}>
        <div className={cn("w-full flex justify-center items-center gap-5 flex-col", className)}>
          {/* File Uploader manages the File states of "Pending", "Error"
      1. It stores it's own file state (buffer of Pending and Error files)
      2. It returns the uploaded Image(s) stored in file state, for hook to manipluate
      2.2 Hook manages uploading and retry of Files, and retruns success to File Uploader
      3. It returns "onRetry" which allows re-upload (retry) of uploading image
      4. Clears state once all files are successfully uploaded
      4.4 Images should then appear in UploadedFilesCard */}

          {/* UPDATE:
        File Uploader should manage the Files states, and manage getting SignedUrls for images.
        2.2 Hook "uploads" and get's signedUrls of successful images
        3. Returns signedUlrs to Form
        4. OnFormSubmission it does the Post on signedUrls to upload images using Fetcher 
      */}
          {/* Handle when max inputted files is reached */}
          {/* Controlled By Context */}
          <FileUploader maxFiles={maxFiles} maxSize={maxSize} multiple />
          <UploadedFiles customLoader={customLoader} />
        </div>
      </UploadContextProvider>
    );
  }
);
UploadShad.displayName = "ImagesInput";

export { UploadShad, type UploadShadProps };
