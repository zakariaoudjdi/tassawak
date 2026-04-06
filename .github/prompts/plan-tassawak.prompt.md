# Plan: E-Commerce Microservices MVP

Build a minimal e-commerce app with a React+Tailwind frontend, two Node.js microservices (API Gateway + Product Service), PostgreSQL, Kafka, Docker, and Kubernetes. Starting with products listing and product detail pages only.

## Architecture

```
[React Frontend (Vite + Tailwind)]
        |
        v
[API Gateway (Express.js)] --REST--> [Product Service (Express.js)]
        |                                       |
        +------------ Kafka <-------------------+
                                                |
                                          [PostgreSQL]
```

## Target Project Structure

```
tassawak/
├── frontend/                    # React + Vite + Tailwind
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/          # Navbar, ProductCard, etc.
│   │   ├── pages/               # ProductsPage, ProductDetailPage
│   │   └── services/api.js      # REST client to API Gateway
├── services/
│   ├── api-gateway/             # Express.js gateway
│   │   └── src/                 # Routes, Kafka consumer, middleware
│   └── product-service/         # Express.js + Sequelize + Kafka
│       └── src/                 # Routes, controllers, models, seed
├── docker-compose.yml           # Local dev: all services + Postgres + Kafka
├── k8s/                         # Kubernetes manifests
└── README.md
```

---

## Phase 1: Restructure & Frontend Setup

1. **Restructure workspace** — Move existing `src/`, `public/`, `index.html`, `vite.config.js`, `package.json`, `eslint.config.js` into `frontend/`
2. **Install Tailwind CSS v4** — Add `tailwindcss` + `@tailwindcss/vite`. Replace `index.css` with `@import "tailwindcss"`
3. **Install React Router v7** — Add `react-router-dom` for page navigation
4. **Create components & pages**:
   - `Navbar.jsx` — app name/logo
   - `ProductCard.jsx` — thumbnail, name, price
   - `ProductsPage.jsx` — grid of product cards, fetches from API Gateway
   - `ProductDetailPage.jsx` — full product info by ID
   - `App.jsx` — React Router: `/` → ProductsPage, `/products/:id` → ProductDetailPage
5. **Create API service layer** — `services/api.js` with `fetch`/`axios`, base URL from `VITE_API_URL` env var

## Phase 2: Product Service (Backend)

6. **Initialize Product Service** — Own `package.json` with `express`, `sequelize`, `pg`, `kafkajs`, `cors`, `dotenv`
7. **PostgreSQL connection** — Sequelize ORM, configured via env vars
8. **Product model** — Fields: `id` (UUID), `name`, `description`, `price`, `image`, `category`, `stock`, timestamps
9. **REST endpoints**:
   - `GET /products` — list all (with pagination)
   - `GET /products/:id` — single product
   - `POST /products` — create (for seeding/admin)
10. **Kafka producer** — Publish `product.created` event to `product-events` topic
11. **Seed script** — 10-15 sample products for development

## Phase 3: API Gateway

12. **Initialize API Gateway** — Own `package.json` with `express`, `http-proxy-middleware`, `kafkajs`, `cors`, `dotenv`
13. **Proxy routes** — Forward `/api/products` to Product Service. CORS for frontend origin
14. **Kafka consumer** — Subscribe to `product-events`, log events (ready for future services)
15. **Error handling** — Centralized error handler + request logging

## Phase 4: Docker Setup

16. **Dockerfiles** — Frontend (multi-stage: Node build → Nginx serve), API Gateway (Node Alpine), Product Service (Node Alpine)
17. **docker-compose.yml** — 6 services: `frontend` (:3000), `api-gateway` (:3001), `product-service` (:3002), `postgres` (:5432), `zookeeper`, `kafka` (:9092). Health checks + depends_on ordering
18. **`.env.example`** — All required env vars documented

## Phase 5: Kubernetes Manifests

19. **Namespace** — `tassawak` namespace
20. **Deployments + Services** — For each component (Frontend, API Gateway, Product Service, PostgreSQL, Zookeeper, Kafka). PVC for Postgres persistence
21. **ConfigMaps & Secrets** — Env vars in ConfigMaps, DB password in Secrets

---

## Tech Stack

| Component       | Technology                          |
| --------------- | ----------------------------------- |
| Frontend        | React 19 + Vite 8 + Tailwind CSS v4 |
| Routing         | React Router v7                     |
| API Gateway     | Express.js                          |
| Product Service | Express.js + Sequelize ORM          |
| Database        | PostgreSQL 16                       |
| Message Broker  | Apache Kafka (with Zookeeper)       |
| Containers      | Docker + Docker Compose             |
| Orchestration   | Kubernetes                          |

## Verification

1. `npm run dev` in `frontend/` — products page renders, detail page navigation works
2. Product Service standalone — `GET /products` and `GET /products/:id` return correct JSON
3. Kafka — product creation publishes event, API Gateway consumer logs it
4. `docker-compose up --build` — all 6 services start, frontend loads data end-to-end
5. K8s manifests applied to minikube/kind — pods running, services accessible

## Decisions

- **Scope**: Products listing + detail ONLY — no cart, checkout, auth, or user management
- **No authentication** in this initial phase
- **Sequelize** as ORM — most popular for Node.js + PostgreSQL
- **Kafka with Zookeeper** (not KRaft) — more documented, standard setup
- **API Gateway** proxies synchronous REST for reads; Kafka for async events/notifications
- **Nginx** serves built frontend in Docker

## Note on Kafka

For this MVP with a single backend service, Kafka demonstrates the message broker pattern but won't have real cross-service consumers yet. The API Gateway will consume product events as a proof-of-concept. Kafka becomes essential when adding services like Inventory or Orders.
