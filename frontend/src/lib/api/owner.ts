import { apiClient } from "./client";
import { BookingResponseDto } from "@/types/booking";
import { FieldResponseDto, FieldType, PageResponse } from "@/types/field";

export interface OwnerDashboardStats {
  totalFields: number;
  todayBookings: number;
  todayRevenue: number;
  monthRevenue: number;
  pendingBookings: number;
}

export interface FieldCreatePayload {
  name: string;
  description?: string;
  address: string;
  district: string;
  city: string;
  fieldType: FieldType;
  basePrice: number;
  facilityIds?: number[];
  imageUrls?: string[];
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

export interface FieldUpdatePayload {
  name?: string;
  description?: string;
  address?: string;
  district?: string;
  city?: string;
  fieldType?: FieldType;
  basePrice?: number;
  facilityIds?: number[];
  imageUrls?: string[];
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

// Lấy số liệu thống kê Dashboard của Chủ sân (Requirement 52)
export async function getOwnerStatsApi(): Promise<OwnerDashboardStats> {
  const res = await apiClient.get("/owner/dashboard/stats");
  return res.data.data;
}

// Lấy danh sách booking của chủ sân
export async function getOwnerBookingsApi(page = 0, size = 10): Promise<PageResponse<BookingResponseDto>> {
  const res = await apiClient.get("/owner/bookings", {
    params: { page, size },
  });
  return res.data.data;
}

// Lấy lịch đặt theo ngày hiển thị Calendar (Requirement 57)
export async function getOwnerBookingsByDateApi(date: string): Promise<BookingResponseDto[]> {
  const res = await apiClient.get("/owner/bookings/calendar", {
    params: { date },
  });
  return res.data.data;
}

// Xác nhận đơn đặt sân (Requirement 37)
export async function confirmBookingApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.put(`/owner/bookings/${id}/confirm`);
  return res.data.data;
}

// Từ chối đơn đặt sân (Requirement 37)
export async function rejectBookingApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.put(`/owner/bookings/${id}/reject`);
  return res.data.data;
}

// Hoàn thành trận đấu để ghi nhận doanh thu (Requirement 37)
export async function completeBookingApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.put(`/owner/bookings/${id}/complete`);
  return res.data.data;
}

// Lấy danh sách các sân bóng thuộc quyền sở hữu
export async function getMyFieldsApi(): Promise<FieldResponseDto[]> {
  const res = await apiClient.get("/owner/fields");
  return res.data.data;
}

// Tạo mới sân bóng (trạng thái ban đầu PENDING_APPROVAL)
export async function createFieldApi(data: FieldCreatePayload): Promise<FieldResponseDto> {
  const res = await apiClient.post("/owner/fields", data);
  return res.data.data;
}

// Cập nhật thông tin sân bóng
export async function updateFieldApi(id: number, data: FieldUpdatePayload): Promise<FieldResponseDto> {
  const res = await apiClient.put(`/owner/fields/${id}`, data);
  return res.data.data;
}

// Xóa sân bóng thuộc sở hữu
export async function deleteFieldApi(id: number): Promise<void> {
  await apiClient.delete(`/owner/fields/${id}`);
}
