import { apiClient } from "./client";
import { PageResponse } from "@/types/field";

export type NotificationType =
  | "BOOKING_CREATED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_REJECTED"
  | "BOOKING_CANCELLED"
  | "BOOKING_COMPLETED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED";

export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  referenceId?: number;
  createdAt: string;
}

// Lấy danh sách thông báo
export async function getMyNotificationsApi(page = 0, size = 20): Promise<PageResponse<NotificationDto>> {
  const res = await apiClient.get("/notifications", {
    params: { page, size },
  });
  return res.data.data;
}

// Đánh dấu đã đọc thông báo
export async function markNotificationAsReadApi(id: number): Promise<void> {
  await apiClient.put(`/notifications/${id}/read`);
}

// Lấy số lượng thông báo chưa đọc
export async function getUnreadCountApi(): Promise<number> {
  const res = await apiClient.get("/notifications/unread-count");
  return res.data.data;
}
