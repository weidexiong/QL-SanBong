import { apiClient } from "./client";
import { PageResponse } from "@/types/field";

export interface ReviewCreateRequest {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface ReviewResponseDto {
  id: number;
  bookingId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Gửi đánh giá cho đơn đặt sân đã hoàn thành
export async function createReviewApi(data: ReviewCreateRequest): Promise<ReviewResponseDto> {
  const res = await apiClient.post("/reviews", data);
  return res.data.data;
}

// Lấy danh sách đánh giá của sân bóng
export async function getFieldReviewsApi(fieldId: number, page = 0, size = 10): Promise<PageResponse<ReviewResponseDto>> {
  const res = await apiClient.get(`/reviews/field/${fieldId}`, {
    params: { page, size },
  });
  return res.data.data;
}
