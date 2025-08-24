import axiosClient from "../lib/axios";
import type {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  RefreshTokenResponse,
  LogoutResponse,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../types";

export const authService = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/signup", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await axiosClient.post("/auth/refresh-token");
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosClient.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const response = await axiosClient.put("/auth/profile", data);
    return response.data;
  },
};
