import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useProductStore from "../../store/useProductStore";
import Button from "../common/Button";
import Loading from "../common/Loading";

// Inner form component that resets when key changes
function ProductEditForm({
  product,
  onSubmit,
  onCancel,
  loading: isSubmitting,
}) {
  const [formData, setFormData] = useState(() => ({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    stock: product?.stock || "",
    imageUrl: product?.imageUrl || "",
  }));

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.stock || formData.stock < 0)
      newErrors.stock = "Valid stock is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    await onSubmit(productData);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white rounded-lg shadow-lg p-8"
    >
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
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

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
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Price *
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
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.stock ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
        </div>
      </div>

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
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedProduct,
    loading,
    fetchProduct,
    updateProduct,
    clearSelectedProduct,
  } = useProductStore();

  useEffect(() => {
    fetchProduct(Number(id));
    return () => clearSelectedProduct();
  }, [id, fetchProduct, clearSelectedProduct]);

  const handleSubmit = async (productData) => {
    try {
      await updateProduct(Number(id), productData);
      toast.success("Product updated successfully!");
      navigate(`/products/${id}`);
    } catch (error) {
      toast.error("Failed to update product: " + error.message);
    }
  };

  const handleCancel = () => {
    navigate(`/products/${id}`);
  };

  if (loading && !selectedProduct) return <Loading />;
  if (!selectedProduct) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Product</h1>
      <ProductEditForm
        key={selectedProduct?.id}
        product={selectedProduct}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}
