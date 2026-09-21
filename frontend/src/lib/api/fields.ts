import { apiClient } from "./client";
import { FieldResponseDto, FieldSearchParams, PageResponse } from "@/types/field";

// Tìm kiếm sân bóng công khai
export async function getFieldsApi(params?: FieldSearchParams): Promise<PageResponse<FieldResponseDto>> {
  const res = await apiClient.get("/fields", { params });
  return res.data.data;
}

// Lấy chi tiết sân bóng theo ID
export async function getFieldDetailApi(id: number): Promise<FieldResponseDto> {
  const res = await apiClient.get(`/fields/${id}`);
  return res.data.data;
}

// Chủ sân lấy danh sách sân của mình
export async function getOwnerFieldsApi(): Promise<FieldResponseDto[]> {
  const res = await apiClient.get("/owner/fields");
  return res.data.data;
}

// Chủ sân tạo mới sân bóng
export async function createOwnerFieldApi(data: any): Promise<FieldResponseDto> {
  const res = await apiClient.post("/owner/fields", data);
  return res.data.data;
}

// Chủ sân cập nhật sân bóng
export async function updateOwnerFieldApi(id: number, data: any): Promise<FieldResponseDto> {
  const res = await apiClient.put(`/owner/fields/${id}`, data);
  return res.data.data;
}

// Chủ sân xóa sân bóng
export async function deleteOwnerFieldApi(id: number): Promise<void> {
  await apiClient.delete(`/owner/fields/${id}`);
}

// Admin lấy toàn bộ danh sách sân
export async function getAdminFieldsApi(params?: { status?: string; page?: number; size?: number }): Promise<PageResponse<FieldResponseDto>> {
  const res = await apiClient.get("/admin/fields", { params });
  return res.data.data;
}

// Admin phê duyệt sân
export async function approveFieldApi(id: number): Promise<FieldResponseDto> {
  const res = await apiClient.put(`/admin/fields/${id}/approve`);
  return res.data.data;
}

// Admin từ chối sân
export async function rejectFieldApi(id: number): Promise<FieldResponseDto> {
  const res = await apiClient.put(`/admin/fields/${id}/reject`);
  return res.data.data;
}
