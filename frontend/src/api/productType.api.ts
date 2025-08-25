import axiosClient from "../lib/axios";
import type {
  ProductType,
  CreateProductTypeRequest,
  UpdateProductTypeRequest,
} from "../types";

export const productTypeApi = {
  getAll: async (): Promise<ProductType[]> => {
    const response = await axiosClient.get("/product-types");
    return response.data;
  },

  getActive: async (): Promise<ProductType[]> => {
    const response = await axiosClient.get("/product-types/active");
    return response.data;
  },

  getById: async (id: string): Promise<ProductType> => {
    const response = await axiosClient.get(`/product-types/${id}`);
    return response.data;
  },

  create: async (data: CreateProductTypeRequest): Promise<ProductType> => {
    const response = await axiosClient.post("/product-types", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateProductTypeRequest
  ): Promise<ProductType> => {
    const response = await axiosClient.put(`/product-types/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await axiosClient.delete(`/product-types/${id}`);
    return response.data;
  },
};
