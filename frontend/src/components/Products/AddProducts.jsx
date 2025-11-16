import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useProductStore from "../../store/useProductStore";
import { uploadImage } from "../../services/imageService";
import Button from "../common/Button";

export default function AddProduct() {
  const navigate = useNavigate();
  const { createProduct, loading } = useProductStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    sku: "",
    inStock: true,
    rating: "",
    reviews: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";

    if (formData.rating && (formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    if (formData.reviews && formData.reviews < 0) {
      newErrors.reviews = "Reviews cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setUploading(true);

      // Upload image if selected
      let imageUrl = "";
      if (imageFile) {
        toast.info("Uploading image...");
        imageUrl = await uploadImage(imageFile);
        toast.success("Image uploaded!");
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand,
        sku: formData.sku,
        inStock: formData.inStock,
        image: imageUrl,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        reviews: formData.reviews ? parseInt(formData.reviews) : undefined,
      };

      await createProduct(productData);
      toast.success("Product created successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create product: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const isSubmitting = loading || uploading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        Add New Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-4 md:p-8"
      >
        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Product Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--color-primary)] transition-colors">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-xs h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-gray-400 text-sm">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Price, Brand, SKU */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price * ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.brand ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Nike, Apple"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.sku ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="PROD-001"
            />
            {errors.sku && (
              <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Electronics, Clothing, Books"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Rating, Reviews, In Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.rating ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="4.5"
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Reviews
            </label>
            <input
              type="number"
              name="reviews"
              value={formData.reviews}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.reviews ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0"
            />
            {errors.reviews && (
              <p className="text-red-500 text-sm mt-1">{errors.reviews}</p>
            )}
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-5 h-5 text-[var(--color-primary)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <span className="text-gray-700 font-medium">In Stock</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {uploading ? "Uploading..." : "Creating..."}
              </span>
            ) : (
              "Create Product"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
