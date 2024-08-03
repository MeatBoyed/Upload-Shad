"use server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { UploadImagesResponse } from "./honoS3Types";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload multiple images to S3 - Image metadata - Tag: `<tagId>=${folderName}`
 * @param imageFolderId Unique folder name to store Images, /<folderName>/<unique-uuid>.webp
 * @param files Collection of images as Files
 * @returns Promise<UploadImagesResponse> FailedImages is empty on success
 */

interface UploadBucketConfig {
  tagId: string;
  BASE_URL: string;
  s3Client: S3Client;
  BUCKET_NAME: string;
  imageFolderId: string;
  PRODUCTION_FOLDER_NAME: string;
}
interface DeleteBucketConfig {
  s3Client: S3Client;
  BUCKET_NAME: string;
  PRODUCTION_FOLDER_NAME: string;
}

export async function uploadImages(
  files: File[],
  {
    tagId,
    BASE_URL,
    s3Client,
    BUCKET_NAME,
    imageFolderId,
    PRODUCTION_FOLDER_NAME,
  }: UploadBucketConfig
): Promise<UploadImagesResponse> {
  let uploadedImages: { url: string; fileName: string }[] = [];
  let failedImages: File[] = [];

  uploadedImages = await Promise.all(
    files.map(async (file) => {
      const key = `${PRODUCTION_FOLDER_NAME}/${imageFolderId}/${uuidv4()}`;

      // Optimize image
      const buffer = Buffer.from(await file.arrayBuffer());
      const optimizedFile = await sharp(buffer)
        .webp({ quality: 70 })
        .toBuffer();

      try {
        // Upload image to S3 via Put Command
        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key, // File Path
            Body: optimizedFile, // formData images
            ContentType: "image/webp", // Allowed types
            Tagging: `${tagId}=${imageFolderId}`,
          })
        );

        return {
          url: `${BASE_URL}/${key}`,
          fileName: file.name,
        };
      } catch (error) {
        failedImages.push(file);
        throw new Error("unable to upload");
      }
    })
  );

  return {
    uploadedImages: uploadedImages,
    failedImages: failedImages,
  };
}

/**
 * Deletes multiple images using their urls.
 * @param imagesUrls Array of image's urls to delete
 * @returns
 */
export async function deleteImages(
  imagesUrls: string[],
  { s3Client, BUCKET_NAME, PRODUCTION_FOLDER_NAME }: DeleteBucketConfig
): Promise<boolean> {
  await Promise.all(
    imagesUrls.map(async (imageUrl) => {
      const parts = imageUrl.split("/");
      const key = `${PRODUCTION_FOLDER_NAME}/${parts[parts.length - 2]}/${
        parts[parts.length - 1]
      }`;

      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key, // File Path
          })
        ); // Execute AWS command
      } catch (error) {
        console.log("Error: ", error);
        throw new Error("Error Deleting images");
      }
    })
  );

  return true;
}
