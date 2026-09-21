import { apiClient } from "./client";
import { BookingCreateRequest, BookingResponseDto, TimeSlot } from "@/types/booking";
import { PageResponse } from "@/types/field";

// Kiểm tra lịch trống theo ngày
export async function getAvailabilityApi(fieldId: number, date: string): Promise<TimeSlot[]> {
  const res = await apiClient.get(`/fields/${fieldId}/availability`, {
    params: { date },
  });
  return res.data.data;
}

// Khách hàng tạo đơn đặt sân
export async function createBookingApi(data: BookingCreateRequest): Promise<BookingResponseDto> {
  const res = await apiClient.post("/bookings", data);
  return res.data.data;
}

// Khách hàng xem lịch sử đặt sân của mình
export async function getMyBookingsApi(page = 0, size = 10): Promise<PageResponse<BookingResponseDto>> {
  const res = await apiClient.get("/bookings", {
    params: { page, size },
  });
  return res.data.data;
}

// Khách hàng xem chi tiết đơn đặt sân
export async function getBookingDetailApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.get(`/bookings/${id}`);
  return res.data.data;
}

// Khách hàng hủy đơn đặt sân
export async function cancelBookingApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.put(`/bookings/${id}/cancel`);
  return res.data.data;
}

// Chủ sân xem danh sách đặt sân
export async function getOwnerBookingsApi(page = 0, size = 10): Promise<PageResponse<BookingResponseDto>> {
  const res = await apiClient.get("/owner/bookings", {
    params: { page, size },
  });
  return res.data.data;
}

// Chủ sân xem lịch theo ngày
export async function getOwnerCalendarApi(date: string): Promise<BookingResponseDto[]> {
  const res = await apiClient.get("/owner/bookings/calendar", {
    params: { date },
  });
  return res.data.data;
}

// Chủ sân xác nhận đơn
export async function confirmBookingApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.put(`/owner/bookings/${id}/confirm`);
  return res.data.data;
}

// Chủ sân từ chối đơn
export async function rejectBookingApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.put(`/owner/bookings/${id}/reject`);
  return res.data.data;
}

// Chủ sân đánh dấu hoàn thành
export async function completeBookingApi(id: number): Promise<BookingResponseDto> {
  const res = await apiClient.put(`/owner/bookings/${id}/complete`);
  return res.data.data;
}

// Admin lấy tất cả booking
export async function getAdminBookingsApi(page = 0, size = 10): Promise<PageResponse<BookingResponseDto>> {
  const res = await apiClient.get("/admin/bookings", {
    params: { page, size },
  });
  return res.data.data;
}
