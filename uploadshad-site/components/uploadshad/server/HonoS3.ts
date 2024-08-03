"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { PostImagesResponse, PostImageError } from "./honoS3Types";
import { uploadImages, deleteImages } from "./S3Crud";

const NEXT_PUBLIC_S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
const NEXT_PUBLIC_S3_BUCKET_LOCATION =
  process.env.NEXT_PUBLIC_S3_BUCKET_LOCATION;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const AWS_S3_BASE_URL = process.env.NEXT_PUBLIC_AWS_S3_BASE_URL;
const AWS_S3_PRODUCTION_FOLDER_NAME = process.env.AWS_S3_PRODUCTION_FOLDER_NAME;

let s3Client: S3Client;
let BASE_URL: string;
let BucketName: string;
let FolderName: string;

// Ensure envs exist
if (
  !NEXT_PUBLIC_S3_BUCKET_LOCATION ||
  !S3_ACCESS_KEY ||
  !S3_SECRET_ACCESS_KEY
) {
  throw new Error(
    "AWS Keys could not be found in .env file. Therefore system is unable to Authenticate to S3 Bucket"
  );
}
if (
  !AWS_S3_BASE_URL ||
  !NEXT_PUBLIC_S3_BUCKET_NAME ||
  !AWS_S3_PRODUCTION_FOLDER_NAME
) {
  throw new Error(
    "AWS S3 Base URL, Bucket Name or Folder could not be found in .env file"
  );
}

// Set Values
try {
  s3Client = new S3Client({
    region: NEXT_PUBLIC_S3_BUCKET_LOCATION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  });

  BASE_URL = AWS_S3_BASE_URL;
  BucketName = NEXT_PUBLIC_S3_BUCKET_NAME;
  FolderName = AWS_S3_PRODUCTION_FOLDER_NAME;
} catch (error) {
  throw new Error("Unable to Authenticate to S3 Bucket");
}

/**
 * Upload multiple images in a unique folder for easy access & efficient storage - also tags and adds meta data fields to each image
 * @param tagId - MetaData tag for images, example <tagId>=<tagValue>
 * @param imageFolderId Unique ID for the folder containing the Collection of images
 * @param images Collection of images to upload to S3
 * @returns PostImagesResponse - Error is empty on success
 */
export async function PostImagesToS3(
  imageFolderId: string,
  tagId: string,
  images: File[]
): Promise<PostImagesResponse> {
  if (images.length === 0)
    return { images: [], error: PostImageError.FileRequired };

  // Upload image process
  const uploadedImages = await uploadImages(images, {
    tagId: tagId,
    s3Client: s3Client,
    BASE_URL: BASE_URL,
    BUCKET_NAME: BucketName,
    imageFolderId: imageFolderId,
    PRODUCTION_FOLDER_NAME: FolderName,
  }); // Url format: https:<aws-domain>/<userId>/<unique-uuid>

  if (uploadedImages.failedImages.length > 0) {
    await deleteImages(
      uploadedImages.uploadedImages.map((images) => images.url),
      {
        s3Client: s3Client,
        BUCKET_NAME: BucketName,
        PRODUCTION_FOLDER_NAME: FolderName,
      }
    );
    return { images: [], error: PostImageError.NoError };
  }

  return {
    images: uploadedImages.uploadedImages,
    error: PostImageError.NoError,
  };
}

export async function DeleteImagesInS3(imageUrls: string[]): Promise<void> {
  await deleteImages(imageUrls, {
    s3Client: s3Client,
    BUCKET_NAME: BucketName,
    PRODUCTION_FOLDER_NAME: FolderName,
  });
}
