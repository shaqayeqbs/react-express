import axiosInstance from "./axiosInstance";

export const api = {
  products: {
    getAll: () => axiosInstance.get("/products"),
    getOne: (id) => axiosInstance.get(`/products/${id}`),
    create: (data) => axiosInstance.post("/products", data),
    update: (id, data) => axiosInstance.put(`/products/${id}`, data),
    delete: (id) => axiosInstance.delete(`/products/${id}`),
    getCategories: () => axiosInstance.get("/products/categories"),
  },
};

export default api;
