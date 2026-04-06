import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { id, name, price, image, category } = product;

  return (
    <Link
      to={`/products/${id}`}
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-4 text-left">
        {category && (
          <span className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
            {category}
          </span>
        )}
        <h3 className="mt-1 text-gray-900 font-semibold text-base leading-snug line-clamp-2">
          {name}
        </h3>
        <p className="mt-2 text-indigo-600 font-bold text-lg">
          ${Number(price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
