import { create } from "zustand";
import { productService } from "../services/productService";

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  productsLoaded: false,
  categoriesLoaded: false,

  fetchProducts: async (forceRefresh = false) => {
    // Don't fetch if products are already loaded and not forcing refresh
    if (get().productsLoaded && !forceRefresh && get().products.length > 0) {
      console.log("📦 Using cached products");
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await productService.getAllProducts();
      console.log("📦 Raw API response:", response);

      // Extract data from response (handle both response.data and response.data.data)
      let products = [];
      if (response?.data?.data) {
        products = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (response?.data) {
        products = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        products = response;
      }

      console.log("📦 Extracted products:", products);

      set({
        products,
        loading: false,
        productsLoaded: true,
        error: null,
      });
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch products",
        loading: false,
        products: [],
      });
    }
  },

  fetchProduct: async (id) => {
    // Check if product exists in cached products first
    const cachedProduct = get().products.find((p) => p.id === Number(id));
    if (cachedProduct) {
      console.log("📦 Using cached product:", cachedProduct);
      set({ selectedProduct: cachedProduct, loading: false, error: null });
      return cachedProduct;
    }

    // If not in cache, fetch from API
    set({ loading: true, error: null });
    try {
      const response = await productService.getProduct(id);
      console.log("📦 Raw product response:", response);

      // Extract product data
      const product = response?.data?.data || response?.data || response;

      set({
        selectedProduct: product,
        loading: false,
        error: null,
      });
      return product;
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch product",
        loading: false,
      });
      throw error;
    }
  },

  fetchCategories: async (forceRefresh = false) => {
    // Don't fetch if categories are already loaded and not forcing refresh
    if (
      get().categoriesLoaded &&
      !forceRefresh &&
      get().categories.length > 0
    ) {
      console.log("📂 Using cached categories");
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await productService.getCategories();
      console.log("📂 Raw categories response:", response);

      // Extract categories from response
      let categories = [];
      if (response?.data?.data) {
        categories = Array.isArray(response.data.data)
          ? response.data.data
          : [];
      } else if (response?.data) {
        categories = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        categories = response;
      }

      console.log("📂 Extracted categories:", categories);

      set({
        categories,
        categoriesLoaded: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      set({
        categories: [],
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch categories",
        loading: false,
      });
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await productService.createProduct(productData);
      console.log("✅ Product created:", response);

      // Extract the created product
      const newProduct = response?.data?.data || response?.data || response;

      set((state) => ({
        products: [newProduct, ...state.products], // Add to beginning
        loading: false,
        productsLoaded: true,
        error: null,
      }));

      return newProduct;
    } catch (error) {
      console.error("❌ Error creating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create product";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const response = await productService.updateProduct(id, productData);
      console.log("✅ Product updated:", response);

      // Extract the updated product
      const updatedProduct = response?.data?.data || response?.data || response;

      set((state) => ({
        products: state.products.map((p) =>
          p.id === Number(id) ? updatedProduct : p
        ),
        selectedProduct:
          state.selectedProduct?.id === Number(id)
            ? updatedProduct
            : state.selectedProduct,
        loading: false,
        error: null,
      }));

      return updatedProduct;
    } catch (error) {
      console.error("❌ Error updating product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      console.log("✅ Product deleted:", id);

      set((state) => ({
        products: state.products.filter((p) => p.id !== Number(id)),
        selectedProduct:
          state.selectedProduct?.id === Number(id)
            ? null
            : state.selectedProduct,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null, error: null }),

  clearError: () => set({ error: null }),

  // Method to force refresh products
  refreshProducts: async () => {
    console.log("🔄 Forcing products refresh...");
    await get().fetchProducts(true);
  },

  // Method to force refresh categories
  refreshCategories: async () => {
    console.log("🔄 Forcing categories refresh...");
    await get().fetchCategories(true);
  },

  // Reset store (useful for testing or logout)
  reset: () =>
    set({
      products: [],
      categories: [],
      selectedProduct: null,
      loading: false,
      error: null,
      productsLoaded: false,
      categoriesLoaded: false,
    }),
}));

export default useProductStore;
