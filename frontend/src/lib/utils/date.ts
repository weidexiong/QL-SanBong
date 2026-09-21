// Tiện ích định dạng ngày giờ chuẩn Việt Nam (vi-VN, Asia/Ho_Chi_Minh)
const TIMEZONE = "Asia/Ho_Chi_Minh";
const LOCALE = "vi-VN";

// Định dạng ngày theo chuẩn Việt Nam dd/MM/yyyy (ví dụ: 21/09/2026)
export function formatDate(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

// Định dạng giờ 24h theo chuẩn Việt Nam HH:mm (ví dụ: 18:00, không dùng AM/PM)
export function formatTime(timeInput: string | Date | null | undefined): string {
  if (!timeInput) return "";
  
  // Nếu là dạng chuỗi HH:mm hoặc HH:mm:ss sẵn có
  if (typeof timeInput === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(timeInput)) {
    return timeInput.substring(0, 5);
  }

  const date = typeof timeInput === "string" ? new Date(timeInput) : timeInput;
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

// Định dạng ngày giờ: HH:mm dd/MM/yyyy
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  const timeStr = formatTime(date);
  const dateStr = formatDate(date);
  return `${timeStr} ${dateStr}`;
}

// Định dạng khoảng giờ: 18:00 - 19:30
export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

// Định dạng thứ ngày tiếng Việt: Thứ Hai, 21/09/2026
export function formatWeekdayDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const dayName = days[date.getDay()];
  return `${dayName}, ${formatDate(date)}`;
}
