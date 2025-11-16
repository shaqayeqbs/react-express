import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/productControllers";

const router = express.Router();

// GET routes
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

// POST routes
router.post("/", createProduct);

// PUT routes
router.put("/:id", updateProduct);

// DELETE routes
router.delete("/:id", deleteProduct);

export default router;
