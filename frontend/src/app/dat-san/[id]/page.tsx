"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import { getFieldDetailApi } from "@/lib/api/fields";
import { getAvailabilityApi, createBookingApi } from "@/lib/api/bookings";
import { FieldResponseDto } from "@/types/field";
import { TimeSlot, BookingResponseDto } from "@/types/booking";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate, formatWeekdayDate } from "@/lib/utils/date";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MapPin,
  User,
  Phone,
  FileText,
  Copy,
  Check,
  Building2,
  CreditCard,
} from "lucide-react";

// Ánh xạ tên/mã ngân hàng sang mã BIN VietQR chuẩn
function getBankBin(bankName?: string): string {
  if (!bankName) return "MB";
  const upper = bankName.toUpperCase().replace(/[\s-]/g, "");
  if (upper.includes("VIETCOMBANK") || upper === "VCB") return "VCB";
  if (upper.includes("TECHCOMBANK") || upper === "TCB") return "TCB";
  if (upper.includes("MB") || upper.includes("QUANDO")) return "MB";
  if (upper.includes("VIETIN") || upper === "CTG" || upper === "ICB") return "ICB";
  if (upper.includes("BIDV")) return "BIDV";
  if (upper.includes("ACB")) return "ACB";
  if (upper.includes("VPBANK") || upper === "VPB") return "VPB";
  if (upper.includes("TPBANK") || upper === "TPB") return "TPB";
  if (upper.includes("AGRI") || upper === "VBA") return "VBA";
  if (upper.includes("SACOM") || upper === "STB") return "STB";
  if (upper.includes("HDB") || upper.includes("HDBANK")) return "HDB";
  if (upper.includes("SHB")) return "SHB";
  if (upper.includes("MSB")) return "MSB";
  if (upper.includes("VIB")) return "VIB";
  if (upper.includes("OCB")) return "OCB";
  return bankName;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const fieldId = Number(params.id);

  // Trạng thái copy
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast(`Đã sao chép ${label} vào khay nhớ tạm`, "info");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Dữ liệu sân bóng & slot
  const [field, setField] = React.useState<FieldResponseDto | null>(null);
  const [slots, setSlots] = React.useState<TimeSlot[]>([]);
  const [isLoadingField, setIsLoadingField] = React.useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);

  // Trạng thái Stepper: 1. Chọn ngày & giờ -> 2. Xác nhận thông tin -> 3. Thanh toán VietQR -> 4. Thành công
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Form đặt sân
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = React.useState<TimeSlot | null>(null);
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [note, setNote] = React.useState("");

  // Kết quả booking
  const [createdBooking, setCreatedBooking] = React.useState<BookingResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Tải chi tiết sân bóng
  React.useEffect(() => {
    if (!fieldId) return;
    getFieldDetailApi(fieldId)
      .then((data) => {
        setField(data);
      })
      .catch((err) => {
        toast("Không thể tải thông tin sân bóng", "error");
      })
      .finally(() => {
        setIsLoadingField(false);
      });
  }, [fieldId, toast]);

  // Cập nhật thông tin mặc định từ user đăng nhập
  React.useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.fullName);
      if (!customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Tải danh sách slot theo ngày đã chọn
  const loadSlots = React.useCallback(async (dateStr: string) => {
    if (!fieldId) return;
    try {
      setIsLoadingSlots(true);
      const res = await getAvailabilityApi(fieldId, dateStr);
      setSlots(res);
      // Reset slot đã chọn nếu không còn khả dụng trên ngày mới
      setSelectedSlot((prev) => {
        if (!prev) return null;
        const exists = res.find((s) => s.startTime === prev.startTime && s.status === "AVAILABLE");
        return exists || null;
      });
    } catch {
      toast("Không thể tải danh sách khung giờ trống", "error");
    } finally {
      setIsLoadingSlots(false);
    }
  }, [fieldId, toast]);

  React.useEffect(() => {
    if (selectedDate) {
      loadSlots(selectedDate);
    }
  }, [selectedDate, loadSlots]);

  // Tạo danh sách 7 ngày tiếp theo để user chọn nhanh
  const next7Days = React.useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      days.push({
        iso,
        date: d,
        label: i === 0 ? "Hôm nay" : i === 1 ? "Ngày mai" : formatWeekdayDate(d).split(",")[0],
        dateFormatted: formatDate(d),
      });
    }
    return days;
  }, []);

  // Chuyển sang Bước 2: Xác nhận
  const handleProceedToConfirm = () => {
    if (!isAuthenticated) {
      toast("Vui lòng đăng nhập để tiến hành đặt sân", "info");
      router.push(`/dang-nhap?redirect=/dat-san/${fieldId}`);
      return;
    }
    if (!selectedSlot) {
      toast("Vui lòng chọn một khung giờ còn trống", "error");
      return;
    }
    setCurrentStep(2);
  };

  // Tạo booking và chuyển sang bước thanh toán
  const handleCreateBooking = async () => {
    if (!selectedSlot || !field) return;

    try {
      setIsSubmitting(true);
      const res = await createBookingApi({
        fieldId: field.id,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        customerName: customerName.trim() || user?.fullName,
        customerPhone: customerPhone.trim() || user?.phone,
        note: note.trim(),
      });

      setCreatedBooking(res);
      setCurrentStep(3);
      toast("Đã khởi tạo đơn đặt sân! Vui lòng hoàn tất thanh toán.", "success");
    } catch (err: any) {
      // Bắt lỗi Double Booking (409 Conflict)
      toast(err.message || "Không thể tạo đơn đặt sân. Vui lòng thử lại.", "error");
      // Tải lại slots để cập nhật trạng thái mới nhất
      loadSlots(selectedDate);
      setCurrentStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xác nhận thanh toán thành công
  const handleCompletePayment = () => {
    setCurrentStep(4);
    toast("Thanh toán thành công! Vé đặt sân của bạn đã được ghi nhận.", "success");
  };

  if (isLoadingField || !field) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-4xl p-12 text-center text-sm text-slate-500">
          Đang tải thông tin đặt sân...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* Stepper Header (4 bước) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <Link href={`/san-bong/${field.id}`} className="hover:text-emerald-600 flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {field.name}
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Đặt lịch sân bóng
            </h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Bước {currentStep} / 4
            </span>
          </div>

          {/* Stepper Indicator */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { step: 1, title: "Chọn ngày & giờ" },
              { step: 2, title: "Xác nhận thông tin" },
              { step: 3, title: "Thanh toán VietQR" },
              { step: 4, title: "Hoàn tất" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col space-y-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    currentStep >= item.step
                      ? "bg-emerald-600 dark:bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold truncate hidden sm:block ${
                    currentStep >= item.step
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {item.step}. {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BƯỚC 1: CHỌN NGÀY & KHUNG GIỜ */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Chọn ngày nhanh trong tuần */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white">
                  <CalendarIcon className="h-4 w-4 text-emerald-600" />
                  <span>Chọn ngày thi đấu</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {next7Days.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.iso)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-md font-bold scale-102"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-semibold text-slate-400">
                          {d.label}
                        </span>
                        <span className="text-xs font-bold mt-0.5">
                          {d.date.getDate()}/{d.date.getMonth() + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lưới chọn khung giờ */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>Chọn khung giờ trống ({formatDate(selectedDate)})</span>
                  </div>

                  {/* Chú thích màu sắc */}
                  <div className="flex items-center space-x-3 text-[11px] font-medium text-slate-500">
                    <div className="flex items-center space-x-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span>Còn trống</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span>Đã đặt</span>
                    </div>
                  </div>
                </div>

                {isLoadingSlots ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Đang kiểm tra tình trạng khung giờ...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {slots.map((slot) => {
                      const isAvailable = slot.status === "AVAILABLE";
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                            !isAvailable
                              ? "border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed line-through opacity-60"
                              : isSelected
                              ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-102 font-bold"
                              : "border-emerald-200 bg-emerald-50/50 text-slate-800 hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-slate-200"
                          }`}
                        >
                          <span className="text-sm font-black">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span
                            className={`text-xs mt-1 font-semibold ${
                              isSelected ? "text-emerald-100" : "text-emerald-700 dark:text-emerald-400"
                            }`}
                          >
                            {formatCurrency(slot.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Cột phải: Tóm tắt đơn & nút tiếp tục */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
                <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
                  Tóm tắt đặt sân
                </h3>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Sân bóng:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">{field.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loại sân:</span>
                    <span className="font-semibold">{field.fieldTypeDisplayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày thi đấu:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Khung giờ:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : "Chưa chọn"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Tổng cộng:</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {selectedSlot ? formatCurrency(selectedSlot.price) : "0 VNĐ"}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full font-bold"
                  size="lg"
                  disabled={!selectedSlot}
                  onClick={handleProceedToConfirm}
                >
                  Tiếp tục
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 2: XÁC NHẬN THÔNG TIN NGƯỜI ĐẶT */}
        {currentStep === 2 && selectedSlot && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200/80 shadow-md dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin người liên hệ</CardTitle>
                  <CardDescription>
                    Ban quản lý sân sẽ liên hệ số điện thoại này để hướng dẫn nhận sân
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Họ và tên người đặt
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Nguyễn Văn A"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Số điện thoại nhận thông báo
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type="tel"
                        placeholder="0912345678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ghi chú thêm cho chủ sân (nếu có)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Ví dụ: Chuẩn bị thêm 2 áo bib hoặc 1 bình nước..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cột phải: Hóa đơn tóm tắt */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
                <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
                  Chi tiết hóa đơn
                </h3>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Sân:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{field.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày đá:</span>
                    <span className="font-semibold">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Khung giờ:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá tiền sân:</span>
                    <span className="font-semibold">{formatCurrency(selectedSlot.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí dịch vụ:</span>
                    <span className="font-semibold text-emerald-600">0 VNĐ (Miễn phí)</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Tổng tiền:</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(selectedSlot.price)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="w-1/3"
                    onClick={() => setCurrentStep(1)}
                  >
                    Quay lại
                  </Button>
                  <Button
                    className="w-2/3 font-bold"
                    isLoading={isSubmitting}
                    loadingText="Đang tạo đơn..."
                    onClick={handleCreateBooking}
                  >
                    Thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 3: THANH TOÁN VIETQR */}
        {currentStep === 3 && createdBooking && (() => {
          const ownerBankName = field?.bankName || "MBBank";
          const ownerBankBin = getBankBin(ownerBankName);
          const ownerAccountNumber = field?.bankAccountNumber || "0912345678";
          const ownerAccountName = field?.bankAccountName || field?.ownerName || "CHỦ SÂN BÓNG";
          const vietQrUrl = `https://img.vietqr.io/image/${ownerBankBin}-${ownerAccountNumber}-compact2.png?amount=${createdBooking.totalPrice}&addInfo=${encodeURIComponent(createdBooking.bookingCode)}&accountName=${encodeURIComponent(ownerAccountName)}`;

          return (
            <div className="max-w-xl mx-auto space-y-6 text-center">
              <Card className="border-slate-200/80 shadow-2xl dark:border-slate-800">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">Quét mã VietQR chuyển khoản trực tiếp</CardTitle>
                  <CardDescription>
                    Mã đơn: <span className="font-bold text-emerald-600">{createdBooking.bookingCode}</span>
                  </CardDescription>
                  <div className="pt-1">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[11px]">
                      Tiền chuyển trực tiếp vào tài khoản Chủ sân
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mã VietQR tạo động theo tài khoản chủ sân */}
                  <div className="mx-auto max-w-[260px] rounded-2xl border-2 border-dashed border-emerald-500/50 bg-white p-4 shadow-sm dark:bg-slate-900">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Napas 24/7"
                      className="h-full w-full object-contain rounded-lg shadow-sm"
                    />
                    <div className="mt-2.5 flex items-center justify-center space-x-1 text-[10px] text-slate-500 font-medium">
                      <Sparkles className="h-3 w-3 text-emerald-500" />
                      <span>Quét bằng mọi ứng dụng Ngân hàng & Ví</span>
                    </div>
                  </div>

                  {/* Chi tiết tài khoản nhận tiền của chủ sân */}
                  <div className="rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60 space-y-3 text-left border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-700">
                      <span className="text-slate-500 flex items-center">
                        <Building2 className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                        Sân bóng & Chủ sân:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                        {field?.name} ({field?.ownerName || "Chủ sân"})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center">
                        <CreditCard className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                        Ngân hàng nhận:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {ownerBankName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Số tài khoản:</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {ownerAccountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ownerAccountNumber, "Số tài khoản")}
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                          title="Sao chép số tài khoản"
                        >
                          {copiedKey === "Số tài khoản" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tên người nhận:</span>
                      <span className="font-mono font-bold uppercase text-slate-900 dark:text-white">
                        {ownerAccountName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Số tiền thanh toán:</span>
                      <span className="font-bold text-emerald-600 text-sm dark:text-emerald-400">
                        {formatCurrency(createdBooking.totalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-700">
                      <span className="text-slate-500">Nội dung CK:</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          {createdBooking.bookingCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(createdBooking.bookingCode, "Nội dung chuyển khoản")}
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                          title="Sao chép nội dung chuyển khoản"
                        >
                          {copiedKey === "Nội dung chuyển khoản" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button
                    className="w-full font-bold shadow-lg shadow-emerald-600/20"
                    size="lg"
                    onClick={handleCompletePayment}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Xác nhận đã chuyển khoản thành công
                  </Button>
                  <p className="text-[11px] text-slate-400">
                    Mã QR đã điền sẵn số tiền & nội dung. Vui lòng chuyển khoản đúng nội dung để vé được kích hoạt nhanh nhất.
                  </p>
                </CardFooter>
              </Card>
            </div>
          );
        })()}

        {/* BƯỚC 4: HOÀN TẤT & MÃ VÉ */}
        {currentStep === 4 && createdBooking && (
          <div className="max-w-lg mx-auto space-y-6 text-center">
            <Card className="border-emerald-200 bg-emerald-50/30 shadow-2xl dark:border-emerald-900 dark:bg-emerald-950/20">
              <CardHeader className="space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 animate-in zoom-in-50">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">
                  Đặt sân thành công!
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Mã vé đặt sân của bạn đã được gửi về thông báo tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 space-y-3 text-xs text-left border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 dark:border-slate-800">
                    <span className="text-slate-500">Mã vé đặt sân:</span>
                    <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {createdBooking.bookingCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sân bóng:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{createdBooking.fieldName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {createdBooking.startTime} - {createdBooking.endTime} ({formatDate(createdBooking.bookingDate)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tổng tiền:</span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(createdBooking.totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Link href="/lich-dat" className="w-full">
                  <Button className="w-full font-bold">
                    Xem lịch đặt của tôi
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full">
                    Quay về Trang chủ
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
