import express, { Router } from "express";
import { v4 as uuidV4 } from "uuid";
import db from "../config/dbConfig";
import { s3 } from "../config/s3Config";
import { getPublicDownloadURL, getPublicUploadURL } from "../utils/s3Utils";
import getAMQChannel from "../config/amqConfig";

const router: Router = express.Router();

const UPLOAD_BUCKET_NAME =
  process.env.S3_UPLOAD_BUCKET || "word-counter-raw-files";
const DOWNLOAD_BUCKET_NAME =
  process.env.S3_DOWNLOAD_BUCKET || "word-counter-result";
const QUEUE_NAME = process.env.AMQ_QUEUE || "to_process";

router.get("/request-upload-link", async (req, res) => {
  try {
    // Get the file name from the query parameter
    const fileName = req.query.fileName as string;
    if (!fileName) {
      return res.status(400).json({ error: "File name is required" });
    }

    // Generate UUID for the file
    const fileId = uuidV4();

    // Store file ID, file name, and processing status in the database
    await db("files").insert({
      id: fileId,
      name: fileName,
    });

    // Generate pre-signed URL for uploading the file
    const uploadURL = await getPublicUploadURL(s3, UPLOAD_BUCKET_NAME, fileId);

    // Return the generated UUID and the pre-signed URL for uploading in the response
    res.json({ fileId, uploadURL });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/enqueue-file", async (req, res) => {
  try {
    // Get the file ID from the query parameter
    const fileId = req.query.fileId as string;
    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    const amqChannel = await getAMQChannel();

    // Put the file ID onto the 'to_process' queue in AMQ
    amqChannel.sendToQueue(QUEUE_NAME, Buffer.from(fileId), {
      persistent: true,
    });

    await db("files").where({ id: fileId }).update({ status: "processing" });

    // Return success response
    res.json({ message: "File enqueued for processing" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/generate-download-url", async (req, res) => {
  try {
    // Get the file ID from the query parameter
    const fileId = req.query.fileId as string;
    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    // Fetch file status from the database
    const file = await db("files").select("status").where("id", fileId).first();
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if file status is "completed"
    if (file.status !== "completed") {
      return res
        .status(403)
        .json({ error: "File processing is not completed" });
    }

    // Generate pre-signed URL for downloading the file from the private bucket
    const downloadURL = await getPublicDownloadURL(
      s3,
      DOWNLOAD_BUCKET_NAME,
      fileId,
    );

    // Return the pre-signed URL for downloading in the response
    res.json({ fileId, downloadURL });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
