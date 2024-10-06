import { z } from "zod";

const AWSVariablesSchema = z.object({
  AWS_BUCKET_NAME: z.string().nonempty(),
  AWS_BUCKET_REGION: z.string().nonempty(),
  AWS_BUCKET_ACCESS_KEY: z.string().nonempty(),
  AWS_BUCKET_PRODUCTION_FOLDER: z.string().nonempty(),
  AWS_BUCKET_SECRET_ACCESS_KEY: z.string().nonempty(),
});
const clientVariablesSchema = z.object({
  NEXT_PUBLIC_HOST_URL: z.string().nonempty(),
  NEXT_PUBLIC_AWS_BASE_URL: z.string().nonempty(),
});

const clientVariables = {
  NEXT_PUBLIC_HOST_URL: process.env.NEXT_PUBLIC_HOST_URL,
  NEXT_PUBLIC_AWS_BASE_URL: process.env.NEXT_PUBLIC_AWS_BASE_URL,
};

const AWSVariables = {
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_BUCKET_ACCESS_KEY: process.env.AWS_BUCKET_ACCESS_KEY,
  AWS_BUCKET_PRODUCTION_FOLDER: process.env.AWS_BUCKET_PRODUCTION_FOLDER,
  AWS_BUCKET_SECRET_ACCESS_KEY: process.env.AWS_BUCKET_SECRET_ACCESS_KEY,
};

export function getClientVariables() {
  if (!clientVariables.NEXT_PUBLIC_HOST_URL) {
    throw new Error("UploadShad Error: Missing NEXT_PUBLIC_HOST_URL");
  } else if (!clientVariables.NEXT_PUBLIC_AWS_BASE_URL) {
    throw new Error("UploadShad Error: Missing NEXT_PUBLIC_AWS_BASE_URL");
  }

  const safeClientVariables = clientVariablesSchema.safeParse(clientVariables);
  if (!safeClientVariables.success) {
    throw new Error("UploadShad Error: Invalid NEXT_PUBLIC env variables");
  }

  return safeClientVariables.data;
}

export function getServerVariables() {
  if (!AWSVariables.AWS_BUCKET_NAME) {
    throw new Error("UploadShad Error: Missing AWS env variable. Ensure AWS_BUCKET_NAME is set");
  } else if (!AWSVariables.AWS_BUCKET_REGION) {
    throw new Error("UploadShad Error: Missing AWS env variable. Ensure AWS_BUCKET_REGION is set");
  } else if (!AWSVariables.AWS_BUCKET_ACCESS_KEY) {
    throw new Error(
      "UploadShad Error: Missing AWS env variable. Ensure AWS_BUCKET_ACCESS_KEY is set"
    );
  } else if (!AWSVariables.AWS_BUCKET_PRODUCTION_FOLDER) {
    throw new Error(
      "UploadShad Error: Missing AWS env variable. Ensure AWS_BUCKET_PRODUCTION_FOLDER is set"
    );
  } else if (!AWSVariables.AWS_BUCKET_SECRET_ACCESS_KEY) {
    throw new Error(
      "UploadShad Error: Missing AWS env variable. Ensure AWS_BUCKET_SECRET_ACCESS_KEY is set"
    );
  }

  const safeAWSVariables = AWSVariablesSchema.safeParse(AWSVariables);
  if (!safeAWSVariables.success) {
    throw new Error("UploadShad Error: Invalid AWS env variables");
  }
  return safeAWSVariables.data;
}
