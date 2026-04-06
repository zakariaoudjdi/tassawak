import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <Link
        to="/"
        className="text-2xl font-bold text-indigo-600 tracking-tight"
      >
        Tassawak
      </Link>
    </nav>
  );
}
