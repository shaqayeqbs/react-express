import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import useProductStore from "../../store/useProductStore";
import ProductCard from "./ProductCard";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";

export default function ProductList() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    categories,
  } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Prepare options for react-select
  const categoryOptions = useMemo(() => {
    const options = [{ value: "all", label: "All Categories" }];
    if (Array.isArray(categories)) {
      categories.forEach((category) => {
        options.push({
          value: category.name,
          label: `${category.name} `,
        });
      });
    }
    return options;
  }, [categories]);

  // IMPORTANT: Add safety check for products
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => {
        const matchesCategory =
          selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
    : [];

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProducts} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">🛍️ Products</h1>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />

        <div className="min-w-[200px]">
          <Select
            value={categoryOptions.find(
              (opt) => opt.value === selectedCategory
            )}
            onChange={(selectedOption) =>
              setSelectedCategory(selectedOption?.value || "all")
            }
            options={categoryOptions}
            isSearchable={false}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "#ffffff",
                borderColor: state.isFocused
                  ? "var(--color-primary)"
                  : "#d1d5db",
                boxShadow: state.isFocused
                  ? "0 0 0 2px rgba(124, 58, 237, 0.5)"
                  : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                minHeight: "42px",
                "&:hover": {
                  borderColor: state.isFocused
                    ? "var(--color-primary)"
                    : "#9ca3af",
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#ffffff",
                zIndex: 20,
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isSelected
                  ? "var(--color-primary)"
                  : state.isFocused
                  ? "#F3E8FF"
                  : "#ffffff",
                color: state.isSelected ? "#ffffff" : "#1f2937",
                "&:hover": {
                  backgroundColor: state.isSelected
                    ? "var(--color-primary)"
                    : "#F3E8FF",
                },
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "#1f2937",
              }),
            }}
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
