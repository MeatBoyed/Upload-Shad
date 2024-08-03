export interface FileState {
  file: File | string;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR";
}

/**
 * This will add the necessary query param to the url
 * to make the browser download the file instead of opening it.
 *
 * You can also override the name of the file by passing the name param.
 */
export function getDownloadUrl(url: string, name?: string) {
  const urlObj = new URL(url);
  urlObj.searchParams.set("download", name ?? "true");
  return urlObj.toString();
}

/**
 * This will format the file size to a human readable format.
 *
 * @example 1024 => 1 KB
 */
export function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "0 Bytes";
  }
  bytes = Number(bytes);
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Returns new UploadedImages states, and gives the order of Images (uploaded & pending)
// for image mapping
// params: uploadedImages: new Uploaded Images state array
export function convertUploadedImages(uploadedimages: FileState[]) {
  let newImages: File[] = [];
  let order: string[] = [];
  uploadedimages.forEach((file) => {
    if (file.progress === "COMPLETE" && typeof file.file === "string")
      order.push(file.file);
    if (file.progress === "PENDING" && file.file instanceof File) {
      order.push(file.file.name);
      newImages.push(file.file);
    }
  });
  return { newImages: newImages, order: order };
}

// Converts deleted Images state array for Property Form to consume
export function convertDeletedImages(deletedImages: FileState[]) {
  let images: string[] = [];
  deletedImages.forEach(
    (file) => typeof file.file === "string" && images.push(file.file)
  );
  return images;
}
