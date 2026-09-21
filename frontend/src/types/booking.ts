// Kiểu dữ liệu quản lý lịch đặt sân
export type SlotStatus = "AVAILABLE" | "BOOKED" | "BLOCKED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED";

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  price: number;
  status: SlotStatus;
}

export interface BookingCreateRequest {
  fieldId: number;
  bookingDate: string; // yyyy-MM-dd
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  customerName?: string;
  customerPhone?: string;
  note?: string;
}

export interface BookingResponseDto {
  id: number;
  bookingCode: string;
  userId: number;
  userEmail: string;
  userName: string;
  userPhone: string;
  fieldId: number;
  fieldName: string;
  fieldAddress: string;
  fieldDistrict: string;
  fieldCity: string;
  fieldImage?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  customerName: string;
  customerPhone: string;
  note: string;
  createdAt: string;
}
