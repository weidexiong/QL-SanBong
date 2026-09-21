// Kiểu dữ liệu sân bóng đá và bộ lọc
export type FieldType = "SAN_5" | "SAN_7" | "SAN_11";
export type FieldStatus = "PENDING_APPROVAL" | "ACTIVE" | "REJECTED" | "INACTIVE";

export interface FacilityDto {
  id: number;
  name: string;
  iconKey: string;
}

export interface FieldImageDto {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface FieldResponseDto {
  id: number;
  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  name: string;
  description: string;
  address: string;
  district: string;
  city: string;
  fieldType: FieldType;
  fieldTypeDisplayName: string;
  basePrice: number;
  status: FieldStatus;
  ratingAverage: number;
  totalReviews: number;
  primaryImageUrl: string;
  images: FieldImageDto[];
  facilities: FacilityDto[];
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface FieldSearchParams {
  keyword?: string;
  city?: string;
  district?: string;
  fieldType?: FieldType;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
