import axiosClient from "../lib/axios";
import type { CreateProductRequest, UpdateProductRequest } from "../types";

export const productApi = {
  getAll: async () => {
    const response = await axiosClient.get("/products");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await axiosClient.get(`/products/search?query=${query}`);
    return response.data;
  },

  getByCategory: async (categoryId: string) => {
    const response = await axiosClient.get(`/products/category/${categoryId}`);
    return response.data;
  },

  getByShop: async (shopId: string) => {
    const response = await axiosClient.get(`/products/shop/${shopId}`);
    return response.data;
  },

  create: async (data: CreateProductRequest) => {
    const response = await axiosClient.post("/products", data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductRequest) => {
    const response = await axiosClient.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },

  uploadImage: async (id: string, image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await axiosClient.post(
      `/products/${id}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteImage: async (id: string, imageId: string) => {
    const response = await axiosClient.delete(
      `/products/${id}/images/${imageId}`
    );
    return response.data;
  },
};
