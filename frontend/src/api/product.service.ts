import axiosClient from "../lib/axios";
import type {
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  GetProductsRequest,
  GetProductsResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  GetProductsByCategoryRequest,
  GetProductsByCategoryResponse,
  GetProductsByShopRequest,
  GetProductsByShopResponse,
  GetProductByIdResponse,
  UploadProductImageResponse,
  DeleteProductImageResponse,
  DeleteProductResponse,
} from "../types";

export const productService = {
  // Public routes
  getAllProducts: async (
    params?: GetProductsRequest
  ): Promise<GetProductsResponse> => {
    const response = await axiosClient.get("/products", { params });
    return response.data;
  },

  getProductById: async (id: string): Promise<GetProductByIdResponse> => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (
    params?: SearchProductsRequest
  ): Promise<SearchProductsResponse> => {
    const response = await axiosClient.get("/products/search", { params });
    return response.data;
  },

  getProductsByCategory: async (
    categoryId: string,
    params?: Omit<GetProductsByCategoryRequest, "categoryId">
  ): Promise<GetProductsByCategoryResponse> => {
    const response = await axiosClient.get(`/products/category/${categoryId}`, {
      params,
    });
    return response.data;
  },

  getProductsByShop: async (
    shopId: string,
    params?: Omit<GetProductsByShopRequest, "shopId">
  ): Promise<GetProductsByShopResponse> => {
    const response = await axiosClient.get(`/products/shop/${shopId}`, {
      params,
    });
    return response.data;
  },

  // Protected routes (Seller/Admin)
  createProduct: async (
    data: CreateProductRequest
  ): Promise<CreateProductResponse> => {
    const response = await axiosClient.post("/products", data);
    return response.data;
  },

  updateProduct: async (
    id: string,
    data: UpdateProductRequest
  ): Promise<UpdateProductResponse> => {
    const response = await axiosClient.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<DeleteProductResponse> => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },

  uploadProductImage: async (
    id: string,
    image: File
  ): Promise<UploadProductImageResponse> => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axiosClient.post(`/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteProductImage: async (
    id: string
  ): Promise<DeleteProductImageResponse> => {
    const response = await axiosClient.delete(`/products/${id}/image`);
    return response.data;
  },
};
