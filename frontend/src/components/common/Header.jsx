import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useCartStore from "../../store/useCartStore";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) =>
    `transition-colors font-medium px-3 py-2 rounded-lg ${
      isActive(path)
        ? "text-[var(--color-primary)] bg-purple-50"
        : "text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-50"
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
          >
            🛍️ Shaq Store
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className={navLinkClass("/")}>
              Products
            </Link>
            <Link to="/products/add" className={navLinkClass("/products/add")}>
              Add Product
            </Link>
            <Link
              to="/cart"
              className={`relative p-2 ${navLinkClass("/cart")}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[var(--color-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-2">
            <Link
              to="/"
              className={`block ${navLinkClass("/")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/products/add"
              className={`block ${navLinkClass("/products/add")}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Add Product
            </Link>
            <Link
              to="/cart"
              className={`flex items-center justify-between ${navLinkClass(
                "/cart"
              )}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Cart
              </span>
              {itemCount > 0 && (
                <span className="bg-[var(--color-primary)] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
