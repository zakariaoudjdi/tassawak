import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../services/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 text-gray-500">
        Loading…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <p className="text-red-500">{error || "Product not found"}</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const { name, description, price, image, category, stock } = product;

  return (
    <main className="px-6 py-8 max-w-4xl mx-auto">
      <Link
        to="/"
        className="text-indigo-600 hover:underline text-sm mb-6 inline-block"
      >
        ← Back to products
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-4">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100 aspect-square">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-8 flex flex-col justify-center gap-4">
            {category && (
              <span className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
                {category}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            {description && (
              <p className="text-gray-600 leading-relaxed">{description}</p>
            )}

            <p className="text-3xl font-bold text-indigo-600">
              ${Number(price).toFixed(2)}
            </p>

            {stock !== undefined && (
              <p
                className={`text-sm font-medium ${stock > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
