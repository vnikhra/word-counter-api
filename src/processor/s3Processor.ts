import { s3 } from "../config/s3Config";
import { getPublicDownloadURL, getPublicUploadURL } from "../utils/s3Utils";

const UPLOAD_BUCKET_NAME =
  process.env.S3_UPLOAD_BUCKET || "word-counter-raw-files";
const DOWNLOAD_BUCKET_NAME =
  process.env.S3_DOWNLOAD_BUCKET || "word-counter-result";

export async function generateUploadUrl(fileId: string) {
  // Generate pre-signed URL for uploading the file
  return await getPublicUploadURL(s3, UPLOAD_BUCKET_NAME, fileId);
}

export async function generateDownloadUrl(fileId: string) {
  // Generate pre-signed URL for downloading the file from the private bucket
  return await getPublicDownloadURL(s3, DOWNLOAD_BUCKET_NAME, fileId);
}
