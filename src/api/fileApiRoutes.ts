import express, { Router } from "express";
import {
  generateDownloadUrl,
  generateUploadUrl,
} from "../processor/s3Processor";
import {
  createFileMeta,
  initFileProcessing,
  isFileProcessingComplete,
} from "../processor/fileProcessor";

const router: Router = express.Router();
router.get("/request-upload-url", async (req, res) => {
  try {
    const fileId = await createFileMeta();
    const uploadURL = await generateUploadUrl(fileId);
    res.json({ fileId, uploadURL });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/enqueue-file", async (req, res) => {
  try {
    const fileId = req.query.fileId as string;
    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }
    await initFileProcessing(fileId);
    res.json({ message: "File enqueued for processing" });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/generate-download-url", async (req, res) => {
  try {
    const fileId = req.query.fileId as string;
    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }
    const status = await isFileProcessingComplete(fileId);
    if (status === null) {
      return res.status(404).json({ error: "File not found" });
    }
    if (!status) {
      return res
        .status(403)
        .json({ error: "File processing is not completed" });
    }
    const downloadURL = await generateDownloadUrl(fileId);
    res.json({ fileId, downloadURL });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
