// Kiểu dữ liệu xác thực và người dùng
export type UserRole = "ROLE_USER" | "ROLE_CHUSAN" | "ROLE_ADMIN";
export type UserStatus = "ACTIVE" | "PENDING" | "REJECTED" | "LOCKED";

export interface UserDto {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserDto;
}
