import api from "./axios";
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  UserProfile,
  CreateProductDto,
  ProductResponse,
  GetProductsParams,
  GetProductsResponse,
  UpdateProductDto,
} from "./types";

export const register = async (
  data: RegisterDto,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/user/profile/myself");
  return response.data;
};

export const createProduct = async (
  data: CreateProductDto,
): Promise<ProductResponse> => {
  const response = await api.post<ProductResponse>("/product", data);
  return response.data;
};

export const getProducts = async (
  params?: GetProductsParams,
): Promise<GetProductsResponse> => {
  const response = await api.get<GetProductsResponse>("/product", { params });
  return response.data;
};
export const updateProduct = async (
  productId: string,
  data: UpdateProductDto,
): Promise<ProductResponse> => {
  const response = await api.patch<ProductResponse>(
    `/product/${productId}`,
    data,
  );

  return response.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await api.delete(`/product/${productId}`);
};
