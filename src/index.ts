import dotenv from "dotenv";
dotenv.config();

import getPostgresConnection from "./config/dbConfig";
import * as s3Config from "./config/s3Config";
import amqConfig from "./config/amqConfig";
import express from "express";

import fileAPIRoutes from "./api/fileApiRoutes";

async function setup() {
  const db = await getPostgresConnection();
  await db.migrate.latest();
  await s3Config.config();
  await amqConfig();
}

setup().then(() => {
  const app = express();
  app.use("/api", fileAPIRoutes);
  const port = process.env.PROCESS_PORT;
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
