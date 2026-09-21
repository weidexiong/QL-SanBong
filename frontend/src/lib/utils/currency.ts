// Tiện ích định dạng tiền tệ Việt Nam Đồng (VNĐ)
// Định dạng hiển thị chuẩn: 150.000 ₫ hoặc 150.000 VNĐ
export function formatCurrency(amount: number | null | undefined, suffix: "₫" | "VNĐ" = "VNĐ"): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${suffix}`;
  }

  // Format số với phân cách hàng nghìn bằng dấu chấm chuẩn Việt Nam
  const formatted = new Intl.NumberFormat("vi-VN").format(amount);
  return `${formatted} ${suffix}`;
}

// Hàm parse chuỗi tiền tệ về số nguyên
export function parseCurrency(currencyStr: string): number {
  if (!currencyStr) return 0;
  const cleanStr = currencyStr.replace(/[^0-9]/g, "");
  return parseInt(cleanStr, 10) || 0;
}
