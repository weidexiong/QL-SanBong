import { apiClient } from "./client";
import { AuthResponse, UserDto, UserRole } from "@/types/auth";

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

// Gọi API đăng nhập
export async function loginApi(params: LoginParams): Promise<AuthResponse> {
  const res = await apiClient.post("/auth/login", params);
  return res.data.data;
}

// Gọi API đăng ký
export async function registerApi(params: RegisterParams): Promise<AuthResponse> {
  const res = await apiClient.post("/auth/register", params);
  return res.data.data;
}

// Gọi API đăng xuất
export async function logoutApi(): Promise<void> {
  await apiClient.post("/auth/logout");
}

// Gọi API lấy thông tin người dùng hiện tại
export async function getMeApi(): Promise<UserDto> {
  const res = await apiClient.get("/auth/me");
  return res.data.data;
}
