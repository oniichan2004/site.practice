export interface RegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type RegisterResponse = AuthTokens;
export type LoginResponse = AuthTokens;

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}
export interface CreateProductDto {
  name: string;
  price: number;
  category: string;
}

export type ProductResponse = {
  id: string;
  name: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type ProductsMeta = {
  page: string;
  take: string;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
export type GetProductsResponse = {
  data: ProductResponse[];
  meta: ProductsMeta;
};

export interface GetProductsParams {
  page?: number;
  take?: number;
  order?: "ASC" | "DESC";
}
export type UpdateProductDto = {
  name?: string;
  price?: number;
  category?: string;
};
