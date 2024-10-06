import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getClientVariables, getServerVariables } from "./secrets";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export class S3Service {
  private s3Client: S3Client;
  private BaseUrl: string;
  private BucketName: string;
  private ProductionFolder: string;

  constructor() {
    const {
      AWS_BUCKET_REGION,
      AWS_BUCKET_ACCESS_KEY,
      AWS_BUCKET_SECRET_ACCESS_KEY,
      AWS_BUCKET_PRODUCTION_FOLDER,
      AWS_BUCKET_NAME,
    } = getServerVariables();
    const { NEXT_PUBLIC_AWS_BASE_URL } = getClientVariables();
    this.ProductionFolder = AWS_BUCKET_PRODUCTION_FOLDER;
    this.BaseUrl = NEXT_PUBLIC_AWS_BASE_URL;
    this.BucketName = AWS_BUCKET_NAME;

    this.s3Client = new S3Client({
      region: AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
      },
    });
  }

  generateKey(folderId?: string) {
    return `${this.ProductionFolder}/${folderId && folderId + "/"}${uuidv4()}`;
  }

  getKeyfromUrl(url: string) {
    return url.split(`${this.BaseUrl}/`)[1];
  }

  async getSignedURL(
    { type, checksum, size, tag, metadata, folderId }: FilePayload,
    { acceptedTypes, maxFileSize }: AWSOptions
  ) {
    // Validate request
    if (!acceptedTypes.includes(type)) {
      return { failure: "Not valid type" };
    }

    if (size > maxFileSize) {
      return { failure: "File too large." };
    }

    const key = this.generateKey(folderId);

    const command = new PutObjectCommand({
      Key: key,
      Tagging: tag,
      ContentType: type,
      Metadata: metadata,
      ContentLength: size,
      ChecksumSHA256: checksum,
      Bucket: this.BucketName,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return { signedURL: url };
  }

  async deleteFile(url: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.BucketName,
      Key: this.getKeyfromUrl(url),
    });

    try {
      await this.s3Client.send(command);
      // console.log("AWS Delete Response: ", response);
      return { success: true };
    } catch (err) {
      return { failure: err };
    }
  }

  async deleteFiles(files: string[]) {
    Promise.all(
      files.map((file, index) => {
        this.deleteFile(file);
      })
    );
  }
}

export const FilePayloadSchema = z.object({
  type: z.string(),
  size: z.number(),
  checksum: z.string(),
  /**
   * Example: `<tagId>=<tagValue>`
   */
  tag: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  folderId: z.string().optional(),
});

export interface AWSOptions {
  acceptedTypes: string[];
  maxFileSize: number;
}

export type FilePayload = z.infer<typeof FilePayloadSchema>;
