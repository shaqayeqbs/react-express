import { Link } from "react-router-dom";
import useCartStore from "../../store/useCartStore";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      if (window.confirm("Remove this item from cart?")) {
        removeFromCart(item.id);
      }
      return;
    }

    if (newQuantity > item.stock) {
      alert(`Only ${item.stock} items available in stock`);
      return;
    }

    updateQuantity(item.id, newQuantity);
  };

  const getImageUrl = () => {
    if (!item.image || item.image.trim() === "") {
      return `https://placehold.co/200x200/3B82F6/FFFFFF/png?text=${encodeURIComponent(
        item.name
      )}`;
    }
    return item.image;
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link to={`/products/${item.id}`} className="flex-shrink-0">
          <img
            src={getImageUrl()}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/200x200/EEE/999/png?text=${encodeURIComponent(
                item.name
              )}`;
            }}
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Link
                to={`/products/${item.id}`}
                className="text-lg font-semibold text-gray-800 hover:text-blue-600"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-600">{item.category}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Remove item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none"
                min="1"
                max={item.stock}
              />
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-xl font-bold text-primary">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                ${item.price.toFixed(2)} each
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= item.stock && (
            <p className="text-orange-600 text-sm mt-2">
              ⚠️ Maximum stock reached ({item.stock} available)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
