import { apiClient } from "./client";
import { BookingResponseDto } from "@/types/booking";
import { FieldResponseDto, PageResponse } from "@/types/field";
import { UserRole } from "@/types/auth";

export interface AdminDashboardStats {
  totalUsers: number;
  totalOwners: number;
  totalFields: number;
  totalBookings: number;
  totalRevenue: number;
  pendingFields: number;
  pendingOwners: number;
}

export type UserStatus = "ACTIVE" | "PENDING" | "REJECTED" | "LOCKED";

export interface UserDto {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

// Thống kê tổng quan Admin (Requirement 52)
export async function getAdminStatsApi(): Promise<AdminDashboardStats> {
  const res = await apiClient.get("/admin/dashboard/stats");
  return res.data.data;
}

// Danh sách người dùng & chủ sân kèm lọc và phân trang (Requirement 36)
export async function getAdminUsersApi(
  role?: string,
  status?: string,
  page = 0,
  size = 10
): Promise<PageResponse<UserDto>> {
  const res = await apiClient.get("/admin/users", {
    params: { role, status, page, size },
  });
  return res.data.data;
}

// Phê duyệt tài khoản chủ sân (Requirement 48)
export async function approveOwnerApi(id: number): Promise<UserDto> {
  const res = await apiClient.put(`/admin/users/${id}/approve-owner`);
  return res.data.data;
}

// Từ chối tài khoản chủ sân (Requirement 48)
export async function rejectOwnerApi(id: number): Promise<UserDto> {
  const res = await apiClient.put(`/admin/users/${id}/reject-owner`);
  return res.data.data;
}

// Khóa hoặc mở khóa tài khoản người dùng (Requirement 36)
export async function toggleLockUserApi(id: number): Promise<UserDto> {
  const res = await apiClient.put(`/admin/users/${id}/toggle-lock`);
  return res.data.data;
}

// Danh sách tất cả sân bóng toàn sàn cho Admin kiểm duyệt (Requirement 49)
export async function getAdminFieldsApi(
  status?: string,
  page = 0,
  size = 10
): Promise<PageResponse<FieldResponseDto>> {
  const res = await apiClient.get("/admin/fields", {
    params: { status, page, size },
  });
  return res.data.data;
}

// Phê duyệt sân bóng sang ACTIVE (Requirement 49)
export async function approveFieldApi(id: number): Promise<FieldResponseDto> {
  const res = await apiClient.put(`/admin/fields/${id}/approve`);
  return res.data.data;
}

// Từ chối sân bóng không đạt chuẩn (Requirement 49)
export async function rejectFieldApi(id: number): Promise<FieldResponseDto> {
  const res = await apiClient.put(`/admin/fields/${id}/reject`);
  return res.data.data;
}

// Xem toàn bộ đơn đặt sân của sàn (Requirement 37)
export async function getAdminBookingsApi(
  page = 0,
  size = 10
): Promise<PageResponse<BookingResponseDto>> {
  const res = await apiClient.get("/admin/bookings", {
    params: { page, size },
  });
  return res.data.data;
}
