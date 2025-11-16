import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import corsMiddleware from "./middleware/cosrConfig";
import { errorHandler, notFound } from "./middleware/errorHandler";
import productRoutes from "./routes/productRoutes";
import uploadRoutes from "./routes/upload";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Product API is running! 🚀",
    endpoints: {
      products: "/api/products",
      categories: "/api/products/categories",
      singleProduct: "/api/products/:id",
      createProduct: "POST /api/products",
    },
  });
});
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server and keep it alive
app
  .listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/products`);
    console.log(`🔥 Press Ctrl+C to stop\n`);
  })
  .on("error", (err: Error) => {
    console.error("❌ Server error:", err);
  });

// Keep process alive
process.stdin.resume();

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

export default app;
