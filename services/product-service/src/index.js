import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import productRoutes from './routes/products.js';
import { disconnectProducer } from './kafka/producer.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/products', productRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  const server = app.listen(PORT, () => {
    console.log(`Product service running on port ${PORT}`);
  });

  const shutdown = async () => {
    server.close();
    await disconnectProducer();
    await sequelize.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((err) => {
  console.error('Failed to start product service:', err);
  process.exit(1);
});
