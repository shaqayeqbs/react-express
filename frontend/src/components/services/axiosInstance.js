import axios from "axios";
import { config } from "../constants/config";

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("📤 API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        "❌ Response Error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("❌ Network Error: No response received");
    } else {
      console.error("❌ Request Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
