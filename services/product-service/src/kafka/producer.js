import { Kafka } from 'kafkajs';
import 'dotenv/config';

const kafka = new Kafka({
  clientId: 'product-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();
let connected = false;

async function connectProducer() {
  if (!connected) {
    await producer.connect();
    connected = true;
  }
}

async function publishProductCreated(product) {
  await connectProducer();
  await producer.send({
    topic: 'product-events',
    messages: [
      {
        key: product.id,
        value: JSON.stringify({ event: 'product.created', data: product }),
      },
    ],
  });
}

async function disconnectProducer() {
  if (connected) {
    await producer.disconnect();
    connected = false;
  }
}

export { publishProductCreated, disconnectProducer };
