import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CreateProductDTO, ProductQuery } from "../types";

const prisma = new PrismaClient();

// GET /products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, inStock, brand, sortBy, order } =
      req.query as unknown as ProductQuery;

    const where: any = {};

    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (inStock !== undefined) where.inStock = inStock === true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice.toString());
      if (maxPrice) where.price.lte = parseFloat(maxPrice.toString());
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = order || "asc";
    }

    const products = await prisma.product.findMany({
      where,
      orderBy:
        Object.keys(orderBy).length > 0 ? orderBy : { createdAt: "desc" },
      include: {
        variants: true,
      },
    });

    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: (error as Error).message,
    });
  }
};

// GET /products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: (error as Error).message,
    });
  }
};

// POST /products
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: CreateProductDTO = req.body;

    // Validation
    if (!productData.name || !productData.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!productData.price || productData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required (must be greater than 0)",
      });
    }

    if (!productData.category || !productData.category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!productData.sku || !productData.sku.trim()) {
      return res.status(400).json({
        success: false,
        message: "SKU is required",
      });
    }

    if (!productData.brand || !productData.brand.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand is required",
      });
    }

    // Check if SKU already exists
    const existingSKU = await prisma.product.findFirst({
      where: { sku: productData.sku },
    });

    if (existingSKU) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU already exists",
      });
    }

    // Validate rating if provided
    if (productData.rating !== undefined) {
      if (productData.rating < 0 || productData.rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 0 and 5",
        });
      }
    }

    // Validate reviews if provided
    if (productData.reviews !== undefined && productData.reviews < 0) {
      return res.status(400).json({
        success: false,
        message: "Reviews count cannot be negative",
      });
    }

    const { variants, ...productFields } = productData;

    const product = await prisma.product.create({
      data: {
        ...productFields,
        variants: variants
          ? {
              create: variants,
            }
          : undefined,
      },
      include: {
        variants: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: (error as Error).message,
    });
  }
};

// PUT /products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productData: Partial<CreateProductDTO> = req.body;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { variants: true },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validation
    if (productData.name !== undefined && !productData.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name cannot be empty",
      });
    }

    if (productData.price !== undefined && productData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    if (productData.category !== undefined && !productData.category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be empty",
      });
    }

    if (productData.sku !== undefined && !productData.sku.trim()) {
      return res.status(400).json({
        success: false,
        message: "SKU cannot be empty",
      });
    }

    if (productData.brand !== undefined && !productData.brand.trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand cannot be empty",
      });
    }

    // Check if new SKU already exists (for another product)
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const existingSKU = await prisma.product.findFirst({
        where: {
          sku: productData.sku,
          id: { not: parseInt(id) },
        },
      });

      if (existingSKU) {
        return res.status(400).json({
          success: false,
          message: "Product with this SKU already exists",
        });
      }
    }

    // Validate rating if provided
    if (productData.rating !== undefined) {
      if (productData.rating < 0 || productData.rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 0 and 5",
        });
      }
    }

    // Validate reviews if provided
    if (productData.reviews !== undefined && productData.reviews < 0) {
      return res.status(400).json({
        success: false,
        message: "Reviews count cannot be negative",
      });
    }

    const { variants, ...productFields } = productData;

    // Handle variants update if provided
    let variantsUpdate = {};
    if (variants) {
      // Delete existing variants and create new ones
      variantsUpdate = {
        variants: {
          deleteMany: {},
          create: variants,
        },
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...productFields,
        ...variantsUpdate,
      },
      include: {
        variants: true,
      },
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: (error as Error).message,
    });
  }
};

// DELETE /products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { variants: true },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete product (variants will be deleted automatically due to cascade)
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: {
        id: parseInt(id),
        name: existingProduct.name,
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: (error as Error).message,
    });
  }
};

// GET /categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });

    const formattedCategories = categories.map(
      (cat: { category: any; _count: { category: any } }) => ({
        name: cat.category,
        count: cat._count.category,
      })
    );

    res.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: (error as Error).message,
    });
  }
};
