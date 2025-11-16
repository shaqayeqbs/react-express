export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  image: string;
  inStock?: boolean;
  category: string;
  rating?: number;
  reviews?: number;
  brand: string;
  sku: string;
  variants?: Array<{
    name: string;
    available?: boolean;
    stock?: number;
  }>;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  inStock?: boolean;
  category?: string;
  rating?: number;
  reviews?: number;
  brand?: string;
}

export interface ProductQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  brand?: string;
  sortBy?: "price" | "rating" | "name";
  order?: "asc" | "desc";
}
