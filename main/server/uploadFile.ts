"use server";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const NEXT_PUBLIC_S3_BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
const NEXT_PUBLIC_S3_BUCKET_LOCATION =
  process.env.NEXT_PUBLIC_S3_BUCKET_LOCATION;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

// Ensure envs exist
if (
  !NEXT_PUBLIC_S3_BUCKET_NAME ||
  !NEXT_PUBLIC_S3_BUCKET_LOCATION ||
  !S3_ACCESS_KEY ||
  !S3_SECRET_ACCESS_KEY
) {
  throw new Error(
    "AWS Keys could not be found. Therefore system is unable to Authenticate to S3 Bucket"
  );
}

const client = new S3Client({
  region: NEXT_PUBLIC_S3_BUCKET_LOCATION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

export async function uploadFilesToS3(userId: string, files: File[]) {
  let uploadedImages: { url: string; fileName: string }[] = [];
  let failedImages: File[] = [];

  uploadedImages = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const optimizedFile = await sharp(buffer)
        .webp({ quality: 70 })
        .toBuffer();
      const key = `${AWS_S3_PRODUCTION_FOLDER_NAME}/${userId}/${uuidv4()}`;

      try {
        await client.send(
          new PutObjectCommand({
            Bucket: NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: key, // File Path
            Body: optimizedFile, // formData images
            ContentType: "image/webp", // Allowed types
            Metadata: {
              userId: userId,
            },
            // ["eq", "$x-amz-meta-userid", userid],
            Tagging: `userid=${userId}`,
          })
        ); // Execute AWS command

        const image = await client.send(
          new GetObjectCommand({
            Bucket: NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: key,
          })
        );

        if (image) {
          return {
            url: `${AWS_S3_BASE_URL}/${key}`,
            fileName: file.name,
          };
        }
      } catch (error) {
        console.log("Error: ", error);
        failedImages.push(file);
        throw new Error("unable to upload");
      }
      throw new Error("unable to upload");
    })
  );

  return {
    uploadedImages: uploadedImages,
    failedImages: failedImages,
  };
}

export async function deleteImages(imagesUrls: string[]) {
  await Promise.all(
    imagesUrls.map(async (imageUrl) => {
      const parts = imageUrl.split("/");
      const key = `${AWS_S3_PRODUCTION_FOLDER_NAME}/${
        parts[parts.length - 2]
      }/${parts[parts.length - 1]}`;

      try {
        await client.send(
          new DeleteObjectCommand({
            Bucket: NEXT_PUBLIC_S3_BUCKET_NAME,
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
