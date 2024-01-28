import getAMQChannel from "../config/amqConfig";

const QUEUE_NAME = process.env.AMQ_QUEUE || "to_process";

export async function pushForProcessing(fileId: string) {
  const amqChannel = await getAMQChannel();

  // Put the file ID onto the 'to_process' queue in AMQ
  amqChannel.sendToQueue(QUEUE_NAME, Buffer.from(fileId), {
    persistent: true,
  });
}
