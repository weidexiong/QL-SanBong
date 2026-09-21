"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import { getMyBookingsApi, cancelBookingApi } from "@/lib/api/bookings";
import { createReviewApi } from "@/lib/api/reviews";
import { BookingResponseDto, BookingStatus } from "@/types/booking";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  XCircle,
  Star,
  Search,
  CheckCircle2,
  RefreshCw,
  QrCode,
  MessageSquarePlus,
} from "lucide-react";

export default function MyBookingsPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [bookings, setBookings] = React.useState<BookingResponseDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Dialog xác nhận hủy booking (Requirement 22)
  const [cancelTarget, setCancelTarget] = React.useState<BookingResponseDto | null>(null);
  const [isCancelling, setIsCancelling] = React.useState(false);

  // Dialog QR vé
  const [qrTarget, setQrTarget] = React.useState<BookingResponseDto | null>(null);

  // Dialog đánh giá sân cho booking hoàn thành (Requirement 50)
  const [reviewTarget, setReviewTarget] = React.useState<BookingResponseDto | null>(null);
  const [rating, setRating] = React.useState<number>(5);
  const [comment, setComment] = React.useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = React.useState<boolean>(false);

  const fetchBookings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyBookingsApi(0, 50);
      setBookings(res.content || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách lịch đặt sân");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, fetchBookings]);

  // Xử lý xác nhận hủy đặt sân
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      setIsCancelling(true);
      await cancelBookingApi(cancelTarget.id);
      toast("Đã hủy lịch đặt sân thành công", "success");
      setCancelTarget(null);
      fetchBookings();
    } catch (err: any) {
      toast(err.message || "Không thể hủy lịch đặt này", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  // Xử lý gửi đánh giá (Requirement 50)
  const handleReviewSubmit = async () => {
    if (!reviewTarget) return;
    try {
      setIsSubmittingReview(true);
      await createReviewApi({
        bookingId: reviewTarget.id,
        rating,
        comment: comment.trim(),
      });
      toast("Đã gửi đánh giá thành công! Cảm ơn bạn.", "success");
      setReviewTarget(null);
      setComment("");
      setRating(5);
      fetchBookings();
    } catch (err: any) {
      toast(err.message || "Không thể gửi đánh giá cho sân này", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Ánh xạ badge trạng thái
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Đã xác nhận</Badge>;
      case "PENDING":
        return <Badge variant="warning">Chờ duyệt</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Hoàn thành</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Đã hủy</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-5xl p-8 text-center text-sm text-slate-500">
          Đang kiểm tra phiên đăng nhập...
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-md p-12 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vui lòng đăng nhập</h2>
          <p className="text-xs text-slate-500">
            Bạn cần đăng nhập để quản lý và xem lại lịch sử các đơn đặt sân bóng.
          </p>
          <Link href="/dang-nhap?redirect=/lich-dat">
            <Button>Đăng nhập ngay</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Lịch đặt sân của tôi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Theo dõi tình trạng đơn đặt sân, xuất vé QR và xem lại lịch sử thi đấu
            </p>
          </div>
          <Link href="/san-bong">
            <Button size="sm" className="font-bold">
              <Search className="mr-1.5 h-3.5 w-3.5" />
              Tìm sân mới
            </Button>
          </Link>
        </div>

        {/* Lỗi tải */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/30">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchBookings}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Tải lại
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Trống (Empty State) */}
        {!isLoading && !error && bookings.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <Calendar className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Chưa có lịch đặt sân nào
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Bạn chưa thực hiện đơn đặt sân nào. Hãy tìm kiếm sân bóng gần bạn để lên lịch trận đấu tiếp theo.
            </p>
            <Link href="/san-bong" className="inline-block pt-2">
              <Button size="sm">Tìm sân ngay</Button>
            </Link>
          </div>
        )}

        {/* Bảng hiển thị trên Desktop & Card layout trên Mobile (Requirement 15: Table Responsive) */}
        {!isLoading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {/* 1. Desktop Table View (hidden on mobile) */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                  <tr>
                    <th className="py-3.5 px-4">Mã đặt</th>
                    <th className="py-3.5 px-4">Sân bóng</th>
                    <th className="py-3.5 px-4">Ngày</th>
                    <th className="py-3.5 px-4">Khung giờ</th>
                    <th className="py-3.5 px-4">Tổng tiền</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {bookings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {item.bookingCode}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-[180px] truncate">
                        {item.fieldName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {formatDate(item.bookingDate)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {item.startTime} - {item.endTime}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {formatCurrency(item.totalPrice)}
                      </td>
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setQrTarget(item)}
                          className="h-8 text-xs font-semibold"
                        >
                          <QrCode className="h-3.5 w-3.5 mr-1" />
                          Vé QR
                        </Button>
                        {item.status === "COMPLETED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReviewTarget(item);
                              setRating(5);
                              setComment("");
                            }}
                            className="h-8 text-xs font-semibold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          >
                            <Star className="h-3.5 w-3.5 mr-1 fill-amber-400 text-amber-400" />
                            Đánh giá
                          </Button>
                        )}
                        {(item.status === "PENDING" || item.status === "CONFIRMED") && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setCancelTarget(item)}
                            className="h-8 text-xs font-semibold"
                          >
                            Hủy
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2. Mobile Card Layout (Requirement 15: Card Layout trên mobile) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {bookings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {item.bookingCode}
                    </span>
                    {renderStatusBadge(item.status)}
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{item.fieldName}</p>
                    <p className="text-slate-500 flex items-center">
                      <Calendar className="mr-1 h-3.5 w-3.5 text-slate-400" />
                      Ngày: {formatDate(item.bookingDate)}
                    </p>
                    <p className="text-slate-500 flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5 text-slate-400" />
                      Giờ: {item.startTime} - {item.endTime}
                    </p>
                    <p className="font-bold text-emerald-600 text-sm pt-1">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQrTarget(item)}
                      className="h-8 text-xs font-semibold"
                    >
                      <QrCode className="h-3.5 w-3.5 mr-1" />
                      Mã vé QR
                    </Button>
                    {item.status === "COMPLETED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReviewTarget(item);
                          setRating(5);
                          setComment("");
                        }}
                        className="h-8 text-xs font-semibold text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      >
                        <Star className="h-3.5 w-3.5 mr-1 fill-amber-400 text-amber-400" />
                        Đánh giá
                      </Button>
                    )}
                    {(item.status === "PENDING" || item.status === "CONFIRMED") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelTarget(item)}
                        className="h-8 text-xs font-semibold"
                      >
                        Hủy lịch
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Dialog Hủy lịch đặt (Requirement 22: Confirm Dialog) */}
      <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent onClose={() => setCancelTarget(null)}>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy lịch đặt sân</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn đặt sân{" "}
              <strong className="text-slate-900 dark:text-white">{cancelTarget?.bookingCode}</strong> tại sân{" "}
              <strong>{cancelTarget?.fieldName}</strong> vào lúc {cancelTarget?.startTime} ngày{" "}
              {cancelTarget && formatDate(cancelTarget.bookingDate)}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)} disabled={isCancelling}>
              Quay lại
            </Button>
            <Button
              variant="destructive"
              isLoading={isCancelling}
              loadingText="Đang hủy..."
              onClick={handleConfirmCancel}
            >
              Hủy lịch đặt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem vé QR */}
      <Dialog open={!!qrTarget} onOpenChange={(open) => !open && setQrTarget(null)}>
        <DialogContent onClose={() => setQrTarget(null)}>
          <DialogHeader>
            <DialogTitle className="text-center">Vé điện tử vào sân</DialogTitle>
            <DialogDescription className="text-center">
              Xuất trình mã này cho nhân viên quản lý tại sân khi nhận sân
            </DialogDescription>
          </DialogHeader>
          {qrTarget && (
            <div className="space-y-4 text-center">
              <div className="mx-auto max-w-[200px] rounded-2xl border-2 border-dashed border-emerald-500 p-3 bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET_${qrTarget.bookingCode}`}
                  alt="QR Ticket"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1.5 dark:bg-slate-800/60 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã vé:</span>
                  <span className="font-mono font-bold text-emerald-600">{qrTarget.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sân bóng:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{qrTarget.fieldName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thời gian:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {qrTarget.startTime} - {qrTarget.endTime} ({formatDate(qrTarget.bookingDate)})
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog đánh giá sân bóng sau khi hoàn thành đơn (Requirement 50) */}
      <Dialog open={!!reviewTarget} onOpenChange={(open) => !open && setReviewTarget(null)}>
        <DialogContent onClose={() => setReviewTarget(null)}>
          <DialogHeader>
            <DialogTitle>Đánh giá sân bóng</DialogTitle>
            <DialogDescription>
              Chia sẻ cảm nhận và mức độ hài lòng của bạn về trận đấu tại{" "}
              <strong className="text-slate-900 dark:text-white">{reviewTarget?.fieldName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Chất lượng sân & Dịch vụ:
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 rounded hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`${star} sao`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-amber-600 ml-2">
                  {rating === 5
                    ? "Rất tốt (5 sao)"
                    : rating === 4
                    ? "Tốt (4 sao)"
                    : rating === 3
                    ? "Bình thường (3 sao)"
                    : rating === 2
                    ? "Chưa tốt (2 sao)"
                    : "Tệ (1 sao)"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nhận xét chi tiết (tùy chọn):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mặt cỏ, đèn chiếu sáng, nhân viên phục vụ, bãi đỗ xe..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white h-24 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewTarget(null)} disabled={isSubmittingReview}>
              Đóng
            </Button>
            <Button
              variant="default"
              isLoading={isSubmittingReview}
              loadingText="Đang gửi..."
              onClick={handleReviewSubmit}
            >
              Gửi đánh giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
