import amqp from "amqplib";
export default async function amqChannel() {
  const amqConnection = await connectToRabbitMQ();
  const amqChannel = await amqConnection.createChannel();

  const queueName = process.env.AMQ_QUEUE || "to-process";

  await amqChannel.assertQueue(queueName, { durable: true });

  console.log("Queue created or already exists");

  return amqChannel;
}

async function connectToRabbitMQ(): Promise<amqp.Connection> {
  const retryDelay = 1000;

  while (true) {
    try {
      console.log('Attempting to connect to RabbitMQ...');
      const amqUrl = process.env.AMQ_URL || "amqp://localhost";
      const connection = await amqp.connect(amqUrl);
      console.log('Connected to RabbitMQ!');
      return connection;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
}