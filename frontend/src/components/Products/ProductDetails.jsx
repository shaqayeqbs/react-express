/* eslint-disable no-unused-vars */
import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import useProductStore from "../../store/useProductStore";
import useCartStore from "../../store/useCartStore";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";
import Button from "../common/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedProduct,
    loading,
    error,
    fetchProduct,
    deleteProduct,
    clearSelectedProduct,
  } = useProductStore();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCartStore();

  // Get current item in cart
  const cartItem = useMemo(() => {
    if (!selectedProduct) return null;
    return cart.find((item) => item.id === selectedProduct.id);
  }, [cart, selectedProduct]);

  const currentQuantity = cartItem?.quantity || 0;

  // Calculate available stock from variants or use stock property
  const availableStock = useMemo(() => {
    if (!selectedProduct) return 0;

    // If product has variants, sum up all variant stocks
    if (
      selectedProduct.variants &&
      Array.isArray(selectedProduct.variants) &&
      selectedProduct.variants.length > 0
    ) {
      return selectedProduct.variants
        .filter((v) => v.available !== false)
        .reduce((total, variant) => total + (variant.stock || 0), 0);
    }

    // Otherwise use stock property (for backward compatibility)
    return selectedProduct.stock || 0;
  }, [selectedProduct]);

  // Check if product is in stock
  const isInStock = selectedProduct?.inStock === true || availableStock > 0;
  const canIncrease = isInStock && currentQuantity < availableStock;

  useEffect(() => {
    fetchProduct(Number(id));
    return () => clearSelectedProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(Number(id));
        toast.success("Product deleted successfully!");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleAddToCart = () => {
    if (!isInStock || availableStock === 0) {
      toast.error("Product is out of stock");
      return;
    }
    addToCart(selectedProduct);
    toast.success("Added to cart!");
  };

  const handleIncreaseQuantity = () => {
    if (!isInStock) {
      toast.error("Product is out of stock");
      return;
    }
    if (currentQuantity >= availableStock) {
      toast.warning(`Only ${availableStock} items available in stock`);
      return;
    }
    if (currentQuantity === 0) {
      addToCart(selectedProduct);
      toast.success("Added to cart!");
    } else {
      updateQuantity(selectedProduct.id, currentQuantity + 1);
      toast.success("Quantity updated!");
    }
  };

  const handleDecreaseQuantity = () => {
    if (currentQuantity > 1) {
      updateQuantity(selectedProduct.id, currentQuantity - 1);
      toast.success("Quantity updated!");
    } else {
      removeFromCart(selectedProduct.id);
      toast.info("Removed from cart");
    }
  };

  const getImageUrl = () => {
    if (!selectedProduct.image || selectedProduct.image === "") {
      return `https://placehold.co/600x400/7C3AED/FFFFFF/png?text=${encodeURIComponent(
        selectedProduct.name
      )}`;
    }
    return selectedProduct.image;
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <ErrorMessage message={error} onRetry={() => fetchProduct(Number(id))} />
    );
  if (!selectedProduct) return <ErrorMessage message="Product not found" />;

  return (
    <div className="container items-center h-screen mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-block mb-6 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
      >
        ← Back to Products
      </Link>

      <div className="bg-white  h-full  md:h-140 rounded-lg mt-5  shadow-lg overflow-hidden ">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={getImageUrl()}
              alt={selectedProduct.name}
              className="w-full h-120  md:h-140 object-conver"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400/EEE/999/png?text=${encodeURIComponent(
                  selectedProduct.name
                )}`;
              }}
            />
          </div>

          <div className="md:w-1/2 flex flex-col p-8">
            <div className="flex items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedProduct.name}
                </h1>
                <span className="inline-block bg-purple-100 text-[var(--color-primary-dark)] px-3 py-1 rounded-full text-sm">
                  {selectedProduct.category}
                </span>
              </div>
              <span className="text-3xl font-bold text-[var(--color-primary)]">
                ${selectedProduct.price.toFixed(2)}
              </span>
            </div>

            <div>
              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                <span className="font-semibold">Stock:</span>{" "}
                <span
                  className={
                    availableStock > 10
                      ? "text-green-600"
                      : availableStock > 0
                      ? "text-orange-600"
                      : "text-red-600"
                  }
                >
                  {availableStock > 0
                    ? `${availableStock} available`
                    : "Out of stock"}
                </span>
              </p>
              {selectedProduct.variants &&
                selectedProduct.variants.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Variants:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.map((variant) => (
                        <span
                          key={variant.id}
                          className={`text-xs px-2 py-1 rounded ${
                            variant.available && variant.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {variant.name}: {variant.stock || 0}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              <p className="text-gray-500 text-sm mt-2">
                Created:{" "}
                {new Date(selectedProduct.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-auto space-y-4">
              {currentQuantity > 0 ? (
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 items-center border-2 rounded-lg ${
                      !canIncrease && currentQuantity >= availableStock
                        ? "border-gray-300 opacity-50"
                        : "border-[var(--color-primary)]"
                    }`}
                  >
                    <button
                      onClick={handleDecreaseQuantity}
                      disabled={currentQuantity === 0}
                      className="px-4 h-10 rounded-l-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      -
                    </button>
                    <span
                      className={`px-6 py-2 text-lg font-semibold min-w-[60px] text-center ${
                        !canIncrease && currentQuantity >= availableStock
                          ? "text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {currentQuantity}
                    </span>
                    <button
                      onClick={handleIncreaseQuantity}
                      disabled={!canIncrease}
                      className="px-4 h-10 rounded-r-lg text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <div
                    className={`flex-1 text-sm ${
                      !isInStock
                        ? "text-red-600 font-semibold"
                        : availableStock - currentQuantity === 0
                        ? "text-orange-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {!isInStock
                      ? "Out of stock"
                      : availableStock - currentQuantity > 0
                      ? `${availableStock - currentQuantity} left in stock`
                      : "No more items available"}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                    variant="primary"
                    className="flex-1"
                  >
                    {!isInStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              )}

              <div className="flex h-12 gap-4">
                <div className="flex-1 flex-col align-middle items-center justify-center px-4  text-center  bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  <Link
                    to={`/products/edit/${selectedProduct.id}`}
                    className=" h-12  justify-center flex m-auto items-center "
                  >
                    Edit
                  </Link>
                </div>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  className="flex-1 text-center items-center"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
