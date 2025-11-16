import axiosInstance from "./axiosInstance";

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await axiosInstance.get("/products");
      console.log("✅ Raw API response:", response);
      console.log("✅ Response data:", response.data);

      // Check if response.data has a 'data' property (your API format)
      if (response.data && response.data.data) {
        return response.data.data;
      }

      // If it's already an array, return it
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Otherwise return empty array
      console.warn("⚠️ Unexpected API response format");
      return [];
    } catch (error) {
      console.error("❌ Failed to get products:", error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Failed to get product:", error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axiosInstance.get("/products/categories");
      console.log("✅ Categories response:", response.data);

      if (response.data && response.data.data) {
        return response.data.data;
      }

      if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.error("❌ Failed to get categories:", error);
      return [];
    }
  },

  createProduct: async (product) => {
    try {
      const response = await axiosInstance.post("/products", product);
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Failed to create product:", error);
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, product);
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Failed to update product:", error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      throw error;
    }
  },
};

export default productService;
