export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "seller";
  avatar?: string;
  phone?: string;
  shop?: {
    _id: string;
    name: string;
    description: string;
  } | null;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  accessToken: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ProfileResponse {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "seller";
  avatar?: string;
  phone?: string;
  shop?: {
    _id: string;
    name: string;
    description: string;
  } | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}
