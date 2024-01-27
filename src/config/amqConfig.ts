import amqp from "amqplib";
export default async function amqChannel() {
  const amqUrl = process.env.AMQ_URL || "amqp://localhost"; // Replace with your RabbitMQ URL
  const amqConnection = await amqp.connect(amqUrl);
  const amqChannel = await amqConnection.createChannel();

  const queueName = process.env.AMQ_QUEUE || "to-process";

  // Assert the queue
  await amqChannel.assertQueue(queueName, { durable: true });

  console.log("Queue created or already exists");

  return amqChannel;
}
