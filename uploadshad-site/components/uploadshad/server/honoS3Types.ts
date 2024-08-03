export enum PostImageError {
  NoError = "NoError",
  FileNotUploaded = "FileNotUploaded",
  FileTooBig = "FileTooBig",
  FileRequired = "FileRequired",
  FileTooSmall = "FileTooSmall",
  FileNotImage = "FileNotImage",
  FileNotSupported = "FileNotSupported",
}

export interface UploadedImages {
  url: string;
  fileName: string;
}

export interface UploadImagesResponse {
  uploadedImages: UploadedImages[];
  failedImages: File[];
}

export interface PostImagesResponse {
  images: UploadedImages[];
  error: PostImageError;
}
