import type { BaseEntity } from "./common.types";

export type ProductType = BaseEntity & {
  name: string;
  description?: string;
  isActive: boolean;
};

export type CreateProductTypeRequest = {
  name: string;
  description?: string;
};

export type UpdateProductTypeRequest = {
  name?: string;
  description?: string;
  isActive?: boolean;
};
