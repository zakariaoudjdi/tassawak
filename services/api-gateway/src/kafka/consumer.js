import { Kafka } from "kafkajs";
import "dotenv/config";

const kafka = new Kafka({
  clientId: "api-gateway",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "api-gateway-group" });
let connected = false;

async function startConsumer() {
  if (connected) return;
  await consumer.connect();
  connected = true;
  await consumer.subscribe({ topic: "product-events", fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value?.toString();
      if (!value) return;
      try {
        const parsed = JSON.parse(value);
        console.log(
          `[Kafka] Event received — topic: ${topic}, partition: ${partition}, event: ${parsed.event}`,
        );
      } catch {
        console.warn(`[Kafka] Failed to parse message from topic: ${topic}`);
      }
    },
  });
}

async function disconnectConsumer() {
  if (connected) {
    await consumer.disconnect();
    connected = false;
  }
}

export { startConsumer, disconnectConsumer };
