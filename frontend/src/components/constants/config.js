export const config = {
  apiUrl:
    import.meta.env.VITE_API_URL ||
    "https://react-express-asso.onrender.com/api",
  apiTimeout: 10000, // 10 seconds
  itemsPerPage: 12,
  currency: "USD",
  currencySymbol: "$",
  appName: import.meta.env.VITE_APP_NAME || "Product Card UI",
};
