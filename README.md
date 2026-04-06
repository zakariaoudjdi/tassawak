# Tassawak — E-Commerce Frontend

A minimal e-commerce frontend built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **React Router v7**. Displays a product listing page and a product detail page, powered by a REST API from the API Gateway.

---

## Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| UI        | React 19 + Vite 8                    |
| Styling   | Tailwind CSS v4                      |
| Routing   | React Router v7                      |
| API calls | Native `fetch` via `services/api.js` |

---

## Project Structure

```
tassawak/
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   └── ProductCard.jsx  # Product thumbnail card (used in grid)
│   │   ├── pages/
│   │   │   ├── ProductsPage.jsx      # / — product grid
│   │   │   └── ProductDetailPage.jsx # /products/:id — full product view
│   │   ├── services/
│   │   │   └── api.js           # REST client (base URL from VITE_API_URL)
│   │   ├── App.jsx              # Router setup
│   │   ├── index.css            # Tailwind entry (@import "tailwindcss")
│   │   └── main.jsx             # React entry point
│   ├── .env.example             # Required environment variables
│   ├── vite.config.js
│   └── package.json
└── .github/
    └── prompts/
        └── plan-tassawak.prompt.md  # Full project implementation plan
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Copy the example env file and set your API Gateway URL:

```bash
cp .env.example .env
```

`.env` content:

```env
VITE_API_URL=http://localhost:3001/api
```

> The frontend proxies all data requests through the API Gateway. Make sure it is running before starting the dev server.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

---

## Pages & Routing

| Route           | Component           | Description                       |
| --------------- | ------------------- | --------------------------------- |
| `/`             | `ProductsPage`      | Responsive grid of all products   |
| `/products/:id` | `ProductDetailPage` | Full details for a single product |

---

## API Integration

All API calls go through `src/services/api.js`. The base URL is read from the `VITE_API_URL` environment variable (defaults to `http://localhost:3001/api`).

| Function         | Endpoint            | Description           |
| ---------------- | ------------------- | --------------------- |
| `getProducts()`  | `GET /products`     | Fetch all products    |
| `getProduct(id)` | `GET /products/:id` | Fetch a product by ID |

Expected product shape from the API:

```json
{
  "id": "uuid",
  "name": "Product Name",
  "description": "...",
  "price": "29.99",
  "image": "https://...",
  "category": "Electronics",
  "stock": 42
}
```

---

## What's Next

This frontend is Phase 1 of a larger microservices project. Upcoming phases:

- **Phase 2** — Product Service (Express.js + Sequelize + PostgreSQL + Kafka)
- **Phase 3** — API Gateway (Express.js proxy + Kafka consumer)
- **Phase 4** — Docker Compose (all services, Postgres, Kafka, Zookeeper)
- **Phase 5** — Kubernetes manifests

See `.github/prompts/plan-tassawak.prompt.md` for the full implementation plan.
