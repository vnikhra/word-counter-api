import { v4 as uuidV4 } from "uuid";
import getPostgresConnection from "../config/dbConfig";
import { pushForProcessing } from "./queueProcessor";

export async function createFileMeta() {
  const fileId = uuidV4();
  const db = await getPostgresConnection();
  await db("files").insert({
    id: fileId,
  });
  return fileId;
}

export async function isFileProcessingComplete(fileId: string) {
  const db = await getPostgresConnection();
  const file = await db("files").select("status").where("id", fileId).first();
  if (!file) {
    return null;
  }
  return file.status === "completed";
}

export async function initFileProcessing(fileId: string) {
  const db = await getPostgresConnection();
  await db("files").where({ id: fileId }).update({ status: "initiated" });
  await pushForProcessing(fileId);
}
