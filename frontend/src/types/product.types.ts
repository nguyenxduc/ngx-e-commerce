export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category:
    | string
    | {
        _id: string;
        name: string;
      };
  shop:
    | string
    | {
        _id: string;
        name: string;
      };
  countInStock: number;
  ratings: number;
  numReviews: number;
  reviews?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  shop: string;
  countInStock: number;
  image: string;
}

export interface CreateProductResponse extends Product {}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  countInStock?: number;
  image?: string;
}

export interface UpdateProductResponse extends Product {}

export interface GetProductsRequest {
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
  };
}

export interface SearchProductsRequest {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "name_asc";
  page?: number;
  limit?: number;
}

export interface SearchProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
  };
}

export interface GetProductsByCategoryRequest {
  categoryId: string;
  page?: number;
  limit?: number;
}

export interface GetProductsByCategoryResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
  };
}

export interface GetProductsByShopRequest {
  shopId: string;
  page?: number;
  limit?: number;
}

export interface GetProductsByShopResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
  };
}

export interface GetProductByIdResponse extends Product {}

export interface UploadProductImageRequest {
  id: string;
  image: File;
}

export interface UploadProductImageResponse {
  product: Product;
  message: string;
}

export interface DeleteProductImageRequest {
  id: string;
}

export interface DeleteProductImageResponse {
  product: Product;
  message: string;
}

export interface DeleteProductResponse {
  message: string;
}

export interface ProductErrorResponse {
  message: string;
  error?: string;
}
