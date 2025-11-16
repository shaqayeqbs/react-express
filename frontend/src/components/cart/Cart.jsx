import { Link, useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import CartItem from "./CartItem";
import Button from "../common/Button";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, getTotal, getItemCount, clearCart } = useCartStore();

  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    alert("Checkout functionality coming soon!");
    // You can add checkout logic here
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link
          to="/"
          className="text-primary hover:text-primary-dark font-medium"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Cart Items
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-danger hover:text-red-800 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax (estimated)</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(total * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              variant="primary"
              className="w-full mb-3"
            >
              Proceed to Checkout
            </Button>

            <Button
              onClick={() => navigate("/")}
              variant="secondary"
              className="w-full"
            >
              Continue Shopping
            </Button>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
