# Tassawak — E-Commerce Microservices

A full-stack e-commerce application built with a microservices architecture. The system includes a React frontend, an API Gateway, a Product Service backed by PostgreSQL, and event streaming via Kafka. All services are fully containerised with Docker Compose and deployable to Kubernetes.

---

## Architecture

```
Browser
  │
  ▼
Frontend (React)  :3000
  │  (REST)
  ▼
API Gateway       :3001  ──► Kafka topic: product-events
  │  (proxy)                        ▲
  ▼                                 │ (publish)
Product Service   :3002  ──────────┘
  │  (Sequelize ORM)
  ▼
PostgreSQL        :5432
```

---

## Tech Stack

| Layer           | Technology                                      |
| --------------- | ----------------------------------------------- |
| UI              | React 19 + Vite 8                               |
| Styling         | Tailwind CSS v4                                 |
| Routing         | React Router v7                                 |
| API Gateway     | Express.js + http-proxy-middleware + KafkaJS    |
| Product Service | Express.js + Sequelize + PostgreSQL + KafkaJS   |
| Database        | PostgreSQL 16                                   |
| Messaging       | Apache Kafka 7.6 + Zookeeper 7.6                |
| Containers      | Docker + Docker Compose                         |
| Orchestration   | Kubernetes                                      |

---

## Project Structure

```
tassawak/
├── docker-compose.yml           # Full stack: all services + infra
├── .env.example                 # Docker Compose environment variables
├── frontend/
│   ├── nginx.conf               # Production nginx config (served in Docker)
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/
│   │   │   ├── ProductsPage.jsx       # / — product grid
│   │   │   └── ProductDetailPage.jsx  # /products/:id — product detail
│   │   ├── services/
│   │   │   └── api.js                 # REST client (base URL from VITE_API_URL)
│   │   ├── App.jsx
│   │   ├── index.css                  # Tailwind entry (@import "tailwindcss")
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── services/
│   ├── api-gateway/
│   │   ├── Dockerfile
│   │   ├── src/
│   │   │   ├── index.js               # Express app + proxy routes
│   │   │   ├── middleware/
│   │   │   │   └── logger.js          # Request logger
│   │   │   └── kafka/
│   │   │       └── consumer.js        # Kafka consumer (product-events topic)
│   │   └── package.json
│   └── product-service/
│       ├── Dockerfile
│       ├── src/
│       │   ├── index.js               # Express app
│       │   ├── db.js                  # Sequelize connection
│       │   ├── seed.js                # Database seeder
│       │   ├── models/
│       │   │   └── Product.js
│       │   ├── controllers/
│       │   │   └── productsController.js
│       │   ├── routes/
│       │   │   └── products.js
│       │   └── kafka/
│       │       └── producer.js        # Publishes product.created events
│       ├── .env.example
│       └── package.json
└── k8s/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secret.yaml
    ├── frontend/
    ├── api-gateway/
    ├── product-service/
    ├── postgres/
    ├── kafka/
    └── zookeeper/
```

---

## Running with Docker Compose

This is the recommended way to run the full stack locally.

### Prerequisites

- **Docker** and **Docker Compose** v2

### 1. Configure environment

```bash
cp .env.example .env
```

The default `.env` sets `DB_PASSWORD=postgres`. Change it if needed.

### 2. Start all services

```bash
docker compose up --build
```

| Service         | URL                        |
| --------------- | -------------------------- |
| Frontend        | http://localhost:3000       |
| API Gateway     | http://localhost:3001       |
| Product Service | http://localhost:3002       |
| PostgreSQL      | localhost:5432              |
| Kafka           | localhost:9092              |

### 3. Seed the database (optional)

```bash
docker compose exec product-service node src/seed.js
```

### 4. Stop

```bash
docker compose down
```

Add `-v` to also remove the PostgreSQL data volume.

---

## Running Services Individually (Development)

### Prerequisites

- **Node.js** v20 or later
- **npm** v9 or later
- Running **PostgreSQL** instance
- Running **Kafka** + **Zookeeper** instance

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # set VITE_API_URL=http://localhost:3001/api
npm run dev                   # http://localhost:5173
```

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

### API Gateway

```bash
cd services/api-gateway
npm install
npm run dev                   # http://localhost:3001
```

Environment variables (set via shell or `.env`):

| Variable              | Default                    | Description                       |
| --------------------- | -------------------------- | --------------------------------- |
| `PORT`                | `3001`                     | Port the gateway listens on       |
| `PRODUCT_SERVICE_URL` | `http://localhost:3002`    | URL of the Product Service        |
| `FRONTEND_ORIGIN`     | `http://localhost:5173`    | Allowed CORS origin               |
| `KAFKA_BROKER`        | `localhost:9092`           | Kafka broker address              |

### Product Service

```bash
cd services/product-service
npm install
cp .env.example .env          # update DB_* and KAFKA_BROKER
npm run dev                   # http://localhost:3002
```

Environment variables (see `.env.example`):

| Variable       | Default              | Description                    |
| -------------- | -------------------- | ------------------------------ |
| `PORT`         | `3002`               | Port the service listens on    |
| `DB_HOST`      | `localhost`          | PostgreSQL host                |
| `DB_PORT`      | `5432`               | PostgreSQL port                |
| `DB_NAME`      | `tassawak_products`  | Database name                  |
| `DB_USER`      | `postgres`           | Database user                  |
| `DB_PASSWORD`  | `postgres`           | Database password              |
| `KAFKA_BROKER` | `localhost:9092`     | Kafka broker address           |

Seed the database:

```bash
npm run seed
```

---

## API Reference

All client requests go through the **API Gateway** (`http://localhost:3001`).

### Health

| Method | Path      | Description                   |
| ------ | --------- | ----------------------------- |
| GET    | `/health` | Returns `{ "status": "ok" }` |

### Products

| Method | Path                 | Description                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/api/products`      | List products (paginated)           |
| GET    | `/api/products/:id`  | Get a single product by UUID        |
| POST   | `/api/products`      | Create a product                    |

#### `GET /api/products`

Query parameters:

| Param   | Default | Max | Description        |
| ------- | ------- | --- | ------------------ |
| `page`  | `1`     | —   | Page number        |
| `limit` | `10`    | `100` | Items per page   |

Response:

```json
{
  "total": 50,
  "page": 1,
  "totalPages": 5,
  "data": [ { ...product } ]
}
```

#### `POST /api/products`

Request body:

```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": "29.99",
  "image": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 42
}
```

#### Product schema

```json
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Product description",
  "price": "29.99",
  "image": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 42,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Kafka Events

| Topic            | Event              | Published by    | Consumed by   |
| ---------------- | ------------------ | --------------- | ------------- |
| `product-events` | `product.created`  | Product Service | API Gateway   |

Event message format:

```json
{
  "event": "product.created",
  "data": { ...product }
}
```

---

## Pages & Routing

| Route           | Component           | Description                       |
| --------------- | ------------------- | --------------------------------- |
| `/`             | `ProductsPage`      | Responsive grid of all products   |
| `/products/:id` | `ProductDetailPage` | Full details for a single product |

---

## Kubernetes

Manifests live in `k8s/`. They target the `tassawak` namespace.

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/zookeeper/
kubectl apply -f k8s/kafka/
kubectl apply -f k8s/product-service/
kubectl apply -f k8s/api-gateway/
kubectl apply -f k8s/frontend/
```
