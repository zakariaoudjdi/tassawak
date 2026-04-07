import "dotenv/config";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import requestLogger from "./middleware/logger.js";
import { startConsumer, disconnectConsumer } from "./kafka/consumer.js";

const app = express();
const PORT = process.env.PORT || 3001;
// In a real setup, these would be in a config file or environment variables
const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(requestLogger);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(
  "/api/products",
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/products": "/products" },
    on: {
      error: (err, _req, res) => {
        console.error("[Proxy] Error:", err.message);
        res.status(502).json({ error: "Bad gateway" });
      },
    },
  }),
);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, _req, res, _next) => {
  console.error("[Gateway] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  const server = app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });

  startConsumer().catch((err) => {
    console.warn("[Kafka] Consumer failed to start:", err.message);
  });

  const shutdown = async () => {
    server.close();
    await disconnectConsumer();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start();
