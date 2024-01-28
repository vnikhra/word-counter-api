import * as AWS from "aws-sdk";
import {
  createBucketIfNotExists,
  setPrivateWritePolicy,
  setPublicReadPolicy,
} from "../utils/s3Utils";

AWS.config.update({ region: "us-east-1" });
export const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true, // Needed for MinIO
  signatureVersion: "v4", // Needed for MinIO
  region: "us-east-1",
});

const uploadBucketName =
  process.env.S3_UPLOAD_BUCKET || "word-counter-raw-files";
const downloadBucketName =
  process.env.S3_DOWNLOAD_BUCKET || "word-counter-result";

export async function config() {
  try {
    // Create public bucket for downloads
    await createBucketIfNotExists(s3, uploadBucketName);
    await setPublicReadPolicy(s3, uploadBucketName);

    // Create private bucket for uploads
    await createBucketIfNotExists(s3, downloadBucketName);
    await setPrivateWritePolicy(s3, downloadBucketName);

    console.log("Buckets created successfully.");
  } catch (err) {
    console.error("An error occurred:", err);
  }
}
