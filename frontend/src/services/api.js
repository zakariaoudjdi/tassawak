import { mockProducts } from "./mockData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getProducts() {
  if (USE_MOCK) {
    return structuredClone(mockProducts);
  }
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id) {
  if (USE_MOCK) {
    const product = mockProducts.find((p) => p.id === Number(id));
    if (!product) throw new Error("Product not found");
    return structuredClone(product);
  }
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
