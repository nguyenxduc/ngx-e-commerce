import type { BaseEntity, UserRole } from "./common.types";

export type User = BaseEntity & {
  name: string;
  email: string;
  role: UserRole;
  shop?: string;
  avatar: string;
  phone: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type UpdateProfileRequest = {
  name?: string;
  phone?: string;
  avatar?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type UserProfile = Omit<User, "password"> & {
  shop?: ShopInfo;
};

export type ShopInfo = {
  _id: string;
  name: string;
  logo: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
