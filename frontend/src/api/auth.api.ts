import axiosClient from "../lib/axios";
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "../types";

export const authApi = {
  login: async (data: LoginRequest) => {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await axiosClient.post("/auth/signup", data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosClient.post("/auth/refresh-token");
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await axiosClient.put("/auth/profile", data);
    return response.data;
  },
};
