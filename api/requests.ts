import api from "./axios"
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  UserProfile,
} from "./types"

export const register = async (
  data: RegisterDto,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", data)
  return response.data
}

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data)
  return response.data
}

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/user/profile/myself")
  return response.data
}
