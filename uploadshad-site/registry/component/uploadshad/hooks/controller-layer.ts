"use client";

import { FileRejection } from "react-dropzone";
import { toast } from "sonner";
import {
  computeSHA256,
  formatBytes,
  getClientVariables,
  FilePayload,
} from "@/registry/component/uploadshad/utils";

const { NEXT_PUBLIC_HOST_URL } = getClientVariables();

export async function handleFetchSignedURL(
  file: File,
  folderId?: string,
  metadata?: Record<string, string>
) {
  // Get PreSign url from API
  const checksum = await computeSHA256(file);
  const payload: FilePayload = {
    type: file.type,
    size: file.size,
    checksum: checksum,
    metadata: metadata,
    folderId: folderId,
  };

  console.log("UploadShad Tracking: PreSigned URL Payload - ", payload);

  const signedURLResult = await fetch(`${NEXT_PUBLIC_HOST_URL}/api/images`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log("UploadShad Tracking: Failed to get PreSigned URL - ", err);
      toast.error(`Failed to upload ${file.name}`, {
        description: "Please try uploading your image again.",
        duration: 5000,
      });
    });

  return signedURLResult.signedURL;
}

// Post File to S3 using PreSign url
export async function handleUploadFile(signedUrl: string, file: File) {
  try {
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    return { url: signedUrl.split("?")[0] };
  } catch (error) {
    console.log("UploadShad Tracking: Failed to Upload File to S3 using PreSigned URL - ", error);
    return { failure: true };
  }
}

// Post File to S3 using PreSign url
export async function handleDeleteFile(url: string) {
  try {
    await fetch(`${NEXT_PUBLIC_HOST_URL}/api/images?url=${url}`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.log("UploadShad Tracking: Failed to Delete File in S3 File URL - ", error);
    return false;
  }
}

// Displays a toast when a file is rejected based on their error reason
export const handleRejectedFiles = (rejectedFiles: FileRejection[], maxSize: number) =>
  rejectedFiles.length > 0 &&
  rejectedFiles.forEach(({ errors, file }) => {
    errors.forEach((error) => {
      switch (error.code) {
        case "file-invalid-type":
          toast.error(`File ${file.name} was rejected.`, {
            description: `${file.type} are not allowed.`,
            duration: 10000,
          });
          break;
        case "file-too-large":
          toast.error(`File ${file.name} was rejected.`, {
            description: `Files bigger than ${formatBytes(maxSize)} are not allowed.`,
            duration: 10000,
          });
          break;
        case "file-too-small":
          toast.error(`File ${file.name} was rejected.`, {
            description: `Files smaller than ${formatBytes(maxSize)} are not allowed.`,
            duration: 10000,
          });
          break;
        case "too-many-files":
          toast.error(`Your files was rejected.`, {
            description: `Too many files were uploaded.`,
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
