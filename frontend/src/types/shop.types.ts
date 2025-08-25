import type { BaseEntity } from "./common.types";

export type Shop = BaseEntity & {
  name: string;
  description: string;
  logo: string;
  banner: string;
  ownerId: string;
  rating: number;
  totalRatings: number;
  followers: number;
  isActive: boolean;
};

export type CreateShopRequest = {
  name: string;
  description: string;
  logo?: string;
  banner?: string;
};

export type UpdateShopRequest = {
  name?: string;
  description?: string;
  logo?: string;
  banner?: string;
  isActive?: boolean;
};
