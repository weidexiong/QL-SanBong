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
import {
  getOwnerStatsApi,
  getOwnerBookingsApi,
  getOwnerBookingsByDateApi,
  confirmBookingApi,
  rejectBookingApi,
  completeBookingApi,
  getMyFieldsApi,
  createFieldApi,
  deleteFieldApi,
  OwnerDashboardStats,
  FieldCreatePayload,
} from "@/lib/api/owner";
import { BookingResponseDto, BookingStatus } from "@/types/booking";
import { FieldResponseDto, FieldType } from "@/types/field";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import {
  Building2,
  Calendar,
  CircleDollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Sparkles,
  CreditCard,
  QrCode,
} from "lucide-react";

export default function OwnerDashboardPage() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Active Tab: "overview" | "calendar" | "fields"
  const [activeTab, setActiveTab] = React.useState<"overview" | "calendar" | "fields">("overview");

  // Stats
  const [stats, setStats] = React.useState<OwnerDashboardStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = React.useState(true);

  // Bookings
  const [bookings, setBookings] = React.useState<BookingResponseDto[]>([]);
  const [isBookingsLoading, setIsBookingsLoading] = React.useState(true);

  // Calendar Date Bookings
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [calendarBookings, setCalendarBookings] = React.useState<BookingResponseDto[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = React.useState(false);

  // Fields
  const [fields, setFields] = React.useState<FieldResponseDto[]>([]);
  const [isFieldsLoading, setIsFieldsLoading] = React.useState(true);

  // Action Dialogs
  const [actionTarget, setActionTarget] = React.useState<{
    booking: BookingResponseDto;
    type: "confirm" | "reject" | "complete";
  } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = React.useState(false);

  // Field Delete Dialog
  const [deleteFieldTarget, setDeleteFieldTarget] = React.useState<FieldResponseDto | null>(null);
  const [isDeletingField, setIsDeletingField] = React.useState(false);

  // Create Field Dialog
  const [isCreateFieldOpen, setIsCreateFieldOpen] = React.useState(false);
  const [isCreatingField, setIsCreatingField] = React.useState(false);
  const [newFieldData, setNewFieldData] = React.useState<FieldCreatePayload>({
    name: "",
    description: "",
    address: "",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    fieldType: "SAN_7",
    basePrice: 200000,
    bankName: "MBBank",
    bankAccountNumber: "",
    bankAccountName: "",
  });

  // Fetch all initial data
  const fetchData = React.useCallback(async () => {
    try {
      setIsStatsLoading(true);
      setIsBookingsLoading(true);
      setIsFieldsLoading(true);

      const [statsRes, bookingsRes, fieldsRes] = await Promise.all([
        getOwnerStatsApi().catch(() => null),
        getOwnerBookingsApi(0, 50).catch(() => ({ content: [] })),
        getMyFieldsApi().catch(() => []),
      ]);

      if (statsRes) setStats(statsRes);
      setBookings(bookingsRes.content || []);
      setFields(fieldsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStatsLoading(false);
      setIsBookingsLoading(false);
      setIsFieldsLoading(false);
    }
  }, []);

  const fetchCalendarBookings = React.useCallback(async (date: string) => {
    try {
      setIsCalendarLoading(true);
      const res = await getOwnerBookingsByDateApi(date);
      setCalendarBookings(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalendarLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated && user?.role === "ROLE_CHUSAN") {
      fetchData();
    }
  }, [isAuthenticated, user, fetchData]);

  React.useEffect(() => {
    if (isAuthenticated && user?.role === "ROLE_CHUSAN" && activeTab === "calendar") {
      fetchCalendarBookings(selectedDate);
    }
  }, [isAuthenticated, user, activeTab, selectedDate, fetchCalendarBookings]);

  // Xử lý booking actions
  const handleBookingAction = async () => {
    if (!actionTarget) return;
    try {
      setIsProcessingAction(true);
      const { booking, type } = actionTarget;
      if (type === "confirm") {
        await confirmBookingApi(booking.id);
        toast("Đã xác nhận đơn đặt sân thành công", "success");
      } else if (type === "reject") {
        await rejectBookingApi(booking.id);
        toast("Đã từ chối đơn đặt sân", "info");
      } else if (type === "complete") {
        await completeBookingApi(booking.id);
        toast("Đã đánh dấu hoàn thành trận đấu", "success");
      }
      setActionTarget(null);
      fetchData();
      if (activeTab === "calendar") {
        fetchCalendarBookings(selectedDate);
      }
    } catch (err: any) {
      toast(err.message || "Xử lý thao tác thất bại", "error");
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Xử lý xóa sân
  const handleDeleteField = async () => {
    if (!deleteFieldTarget) return;
    try {
      setIsDeletingField(true);
      await deleteFieldApi(deleteFieldTarget.id);
      toast("Đã xóa sân bóng thành công", "success");
      setDeleteFieldTarget(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Không thể xóa sân bóng này", "error");
    } finally {
      setIsDeletingField(false);
    }
  };

  // Xử lý tạo sân mới
  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldData.name.trim() || !newFieldData.address.trim()) {
      toast("Vui lòng điền đầy đủ tên sân và địa chỉ", "error");
      return;
    }
    try {
      setIsCreatingField(true);
      await createFieldApi(newFieldData);
      toast("Đã tạo sân bóng mới thành công! Đang chờ Admin duyệt.", "success");
      setIsCreateFieldOpen(false);
      setNewFieldData({
        name: "",
        description: "",
        address: "",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
        fieldType: "SAN_7",
        basePrice: 200000,
        bankName: "MBBank",
        bankAccountNumber: "",
        bankAccountName: "",
      });
      fetchData();
    } catch (err: any) {
      toast(err.message || "Không thể tạo sân bóng", "error");
    } finally {
      setIsCreatingField(false);
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Đã xác nhận</Badge>;
      case "PENDING":
        return <Badge variant="warning">Chờ xác nhận</Badge>;
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
          Đang kiểm tra quyền truy cập...
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ROLE_CHUSAN") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-md p-12 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Khu vực dành riêng cho Chủ sân</h2>
          <p className="text-xs text-slate-500">
            Bạn cần đăng nhập với tài khoản đối tác Chủ sân (ROLE_CHUSAN) để truy cập giao diện quản lý này.
          </p>
          <Link href="/dang-nhap">
            <Button>Đăng nhập tài khoản Chủ sân</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 py-8 flex-1">
        {/* Top Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Quản lý sân bóng
              </h1>
              <Badge variant="success" className="text-xs">
                Chủ sân
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi doanh thu, tiếp nhận lịch đặt và quản lý danh mục cụm sân của bạn
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchData} className="text-xs">
              <RefreshCw className="h-4 w-4 mr-1" />
              Làm mới dữ liệu
            </Button>
            <Button size="sm" onClick={() => setIsCreateFieldOpen(true)} className="text-xs">
              <Plus className="h-4 w-4 mr-1" />
              Thêm sân mới
            </Button>
          </div>
        </div>

        {/* 5 KPI Metric Cards (Requirement 52) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {/* Card 1: Tổng số sân */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tổng sân bóng</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
              {isStatsLoading ? <Skeleton className="h-7 w-12" /> : stats?.totalFields ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Sân đang quản lý</p>
          </div>

          {/* Card 2: Booking hôm nay */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Đặt sân hôm nay</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
              {isStatsLoading ? <Skeleton className="h-7 w-12" /> : stats?.todayBookings ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Lượt trận đấu</p>
          </div>

          {/* Card 3: Doanh thu hôm nay */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Doanh thu ngày</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <CircleDollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-2 truncate">
              {isStatsLoading ? <Skeleton className="h-7 w-20" /> : formatCurrency(stats?.todayRevenue ?? 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Trận đã hoàn thành</p>
          </div>

          {/* Card 4: Doanh thu tháng */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Doanh thu tháng</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-lg font-black text-purple-600 dark:text-purple-400 mt-2 truncate">
              {isStatsLoading ? <Skeleton className="h-7 w-20" /> : formatCurrency(stats?.monthRevenue ?? 0)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Tháng hiện tại</p>
          </div>

          {/* Card 5: Chờ xác nhận */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Chờ duyệt</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-2">
              {isStatsLoading ? <Skeleton className="h-7 w-12" /> : stats?.pendingBookings ?? 0}
            </div>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Cần xử lý ngay</p>
          </div>
        </div>

        {/* Navigation Tabs (Requirement 13 & 14) */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overview"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Tổng quan & Yêu cầu</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "calendar"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            <span>Lịch thi đấu</span>
          </button>

          <button
            onClick={() => setActiveTab("fields")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "fields"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Danh sách sân ({fields.length})</span>
          </button>
        </div>

        {/* TAB 1: TỔNG QUAN & TẤT CẢ BOOKINGS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Danh sách yêu cầu & Đơn đặt sân mới nhất
              </h2>
              <span className="text-xs text-slate-500">Tổng cộng {bookings.length} đơn</span>
            </div>

            {isBookingsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <Calendar className="mx-auto h-8 w-8 text-slate-400" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">Chưa có đơn đặt sân nào</p>
                <p className="text-xs text-slate-500">Khi khách hàng đặt sân, thông tin sẽ xuất hiện tại đây.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table (Requirement 15) */}
                <div className="hidden md:block rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400">
                      <tr>
                        <th className="py-3 px-4">Mã đơn</th>
                        <th className="py-3 px-4">Khách hàng</th>
                        <th className="py-3 px-4">Sân bóng</th>
                        <th className="py-3 px-4">Ngày thi đấu</th>
                        <th className="py-3 px-4">Khung giờ</th>
                        <th className="py-3 px-4">Tiền sân</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {bookings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {item.bookingCode}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-900 dark:text-white">{item.customerName}</p>
                            <p className="text-[11px] text-slate-400">{item.customerPhone}</p>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-[150px] truncate">
                            {item.fieldName}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                            {formatDate(item.bookingDate)}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {item.startTime} - {item.endTime}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600">
                            {formatCurrency(item.totalPrice)}
                          </td>
                          <td className="py-3 px-4">
                            {renderStatusBadge(item.status)}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {item.status === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => setActionTarget({ booking: item, type: "confirm" })}
                                  className="h-7 text-[11px] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  Duyệt
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setActionTarget({ booking: item, type: "reject" })}
                                  className="h-7 text-[11px] px-2.5"
                                >
                                  Từ chối
                                </Button>
                              </>
                            )}
                            {item.status === "CONFIRMED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActionTarget({ booking: item, type: "complete" })}
                                className="h-7 text-[11px] px-2.5 text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50"
                              >
                                Hoàn thành
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout (Requirement 15) */}
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
                        <p className="text-slate-600 dark:text-slate-300">
                          Khách: <strong className="text-slate-900 dark:text-white">{item.customerName}</strong> ({item.customerPhone})
                        </p>
                        <p className="text-slate-500">Ngày: {formatDate(item.bookingDate)}</p>
                        <p className="text-slate-500">Giờ: {item.startTime} - {item.endTime}</p>
                        <p className="font-bold text-emerald-600 text-sm">{formatCurrency(item.totalPrice)}</p>
                      </div>
                      <div className="flex justify-end space-x-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                        {item.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => setActionTarget({ booking: item, type: "confirm" })}
                              className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Xác nhận
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setActionTarget({ booking: item, type: "reject" })}
                              className="h-8 text-xs font-semibold"
                            >
                              Từ chối
                            </Button>
                          </>
                        )}
                        {item.status === "CONFIRMED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActionTarget({ booking: item, type: "complete" })}
                            className="h-8 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Xác nhận hoàn thành
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: LỊCH THI ĐẤU (CALENDAR OWNER - Requirement 57) */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Chọn ngày theo dõi:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                  className="text-xs"
                >
                  Hôm nay
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchCalendarBookings(selectedDate)}
                  className="text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Làm mới
                </Button>
              </div>
            </div>

            {isCalendarLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : calendarBookings.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <Clock className="mx-auto h-8 w-8 text-slate-400" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Chưa có lịch đặt sân nào trong ngày {formatDate(selectedDate)}
                </p>
                <p className="text-xs text-slate-500">Các khung giờ trong ngày này hiện đang còn trống.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendarBookings.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center">
                        <Clock className="mr-1.5 h-4 w-4 text-emerald-600" />
                        {item.startTime} - {item.endTime}
                      </span>
                      {renderStatusBadge(item.status)}
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.fieldName}</p>
                      <p className="text-slate-600 dark:text-slate-300">
                        Khách: <strong>{item.customerName}</strong> ({item.customerPhone})
                      </p>
                      <p className="font-bold text-emerald-600">{formatCurrency(item.totalPrice)}</p>
                    </div>
                    <div className="flex justify-end space-x-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      {item.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setActionTarget({ booking: item, type: "confirm" })}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Xác nhận
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setActionTarget({ booking: item, type: "reject" })}
                            className="h-7 text-xs"
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                      {item.status === "CONFIRMED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActionTarget({ booking: item, type: "complete" })}
                          className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Hoàn thành
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DANH SÁCH SÂN BÓNG THUỘC QUYỀN SỞ HỮU */}
        {activeTab === "fields" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Danh sách các cụm sân đang quản lý
              </h2>
              <Button size="sm" onClick={() => setIsCreateFieldOpen(true)} className="text-xs">
                <Plus className="h-4 w-4 mr-1" />
                Thêm sân bóng
              </Button>
            </div>

            {isFieldsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            ) : fields.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <Building2 className="mx-auto h-8 w-8 text-slate-400" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">Bạn chưa có sân bóng nào</p>
                <p className="text-xs text-slate-500">Đăng tải sân bóng đầu tiên để bắt đầu nhận yêu cầu đặt lịch.</p>
                <Button onClick={() => setIsCreateFieldOpen(true)} className="mt-2 text-xs">
                  <Plus className="h-4 w-4 mr-1" />
                  Đăng tải sân mới
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {field.fieldType === "SAN_5" ? "Sân 5 người" : field.fieldType === "SAN_7" ? "Sân 7 người" : "Sân 11 người"}
                        </span>
                        {field.status === "ACTIVE" ? (
                          <Badge variant="success">Hoạt động</Badge>
                        ) : field.status === "PENDING_APPROVAL" ? (
                          <Badge variant="warning">Chờ duyệt</Badge>
                        ) : (
                          <Badge variant="destructive">Từ chối</Badge>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                        {field.name}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center mt-1">
                        <MapPin className="mr-1 h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{field.address}, {field.district}</span>
                      </p>

                      <p className="font-bold text-emerald-600 text-sm mt-3">
                        {formatCurrency(field.basePrice)} / trận
                      </p>

                      {/* Thông tin tài khoản nhận tiền VietQR */}
                      <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] dark:bg-slate-800/60 mt-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-200">
                            <CreditCard className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="font-bold">{field.bankName || "MBBank"}:</span>
                            <span className="font-mono">{field.bankAccountNumber || "Chưa cấu hình"}</span>
                          </div>
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            VietQR
                          </span>
                        </div>
                        {field.bankAccountName && (
                          <div className="text-[10px] text-slate-400 uppercase font-mono pl-5 truncate">
                            {field.bankAccountName}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <Link href={`/san-bong/${field.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold">
                          Xem trang sân
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteFieldTarget(field)}
                        className="h-8 text-xs font-semibold"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Xóa sân
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CONFIRM DIALOG BOOKING ACTION (Requirement 22) */}
      <Dialog open={!!actionTarget} onOpenChange={(open) => !open && setActionTarget(null)}>
        <DialogContent onClose={() => setActionTarget(null)}>
          <DialogHeader>
            <DialogTitle>
              {actionTarget?.type === "confirm"
                ? "Xác nhận duyệt đơn đặt sân"
                : actionTarget?.type === "reject"
                ? "Xác nhận từ chối đơn đặt sân"
                : "Xác nhận hoàn thành trận đấu"}
            </DialogTitle>
            <DialogDescription>
              {actionTarget?.type === "confirm" && (
                <>Bạn có chắc muốn phê duyệt đơn đặt sân <strong>{actionTarget.booking.bookingCode}</strong> của khách hàng <strong>{actionTarget.booking.customerName}</strong>?</>
              )}
              {actionTarget?.type === "reject" && (
                <>Bạn có chắc muốn từ chối đơn đặt sân <strong>{actionTarget.booking.bookingCode}</strong>? Thao tác này sẽ hủy lịch đặt của khách hàng.</>
              )}
              {actionTarget?.type === "complete" && (
                <>Xác nhận trận đấu của đơn <strong>{actionTarget.booking.bookingCode}</strong> đã diễn ra thành công để ghi nhận doanh thu?</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionTarget(null)} disabled={isProcessingAction}>
              Quay lại
            </Button>
            <Button
              variant={actionTarget?.type === "reject" ? "destructive" : "default"}
              isLoading={isProcessingAction}
              loadingText="Đang xử lý..."
              onClick={handleBookingAction}
            >
              {actionTarget?.type === "confirm" ? "Duyệt đơn" : actionTarget?.type === "reject" ? "Từ chối" : "Hoàn thành"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DIALOG DELETE FIELD (Requirement 22) */}
      <Dialog open={!!deleteFieldTarget} onOpenChange={(open) => !open && setDeleteFieldTarget(null)}>
        <DialogContent onClose={() => setDeleteFieldTarget(null)}>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sân bóng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sân bóng <strong>{deleteFieldTarget?.name}</strong>? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFieldTarget(null)} disabled={isDeletingField}>
              Quay lại
            </Button>
            <Button
              variant="destructive"
              isLoading={isDeletingField}
              loadingText="Đang xóa..."
              onClick={handleDeleteField}
            >
              Xóa sân bóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG CREATE NEW FIELD (Requirement 49) */}
      <Dialog open={isCreateFieldOpen} onOpenChange={setIsCreateFieldOpen}>
        <DialogContent onClose={() => setIsCreateFieldOpen(false)} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Đăng tải sân bóng mới</DialogTitle>
            <DialogDescription>
              Điền thông tin sân bóng để gửi đến ban quản trị phê duyệt trước khi mở đặt sân.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateField} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tên sân bóng *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Sân Bóng Chuyên Nghiệp Thống Nhất"
                value={newFieldData.name}
                onChange={(e) => setNewFieldData({ ...newFieldData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Loại sân *
                </label>
                <select
                  value={newFieldData.fieldType}
                  onChange={(e) => setNewFieldData({ ...newFieldData, fieldType: e.target.value as FieldType })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-medium"
                >
                  <option value="SAN_5">Sân 5 người</option>
                  <option value="SAN_7">Sân 7 người</option>
                  <option value="SAN_11">Sân 11 người</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Giá cơ bản (VNĐ / trận) *
                </label>
                <input
                  type="number"
                  required
                  min="50000"
                  step="10000"
                  value={newFieldData.basePrice}
                  onChange={(e) => setNewFieldData({ ...newFieldData, basePrice: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Địa chỉ chi tiết *
              </label>
              <input
                type="text"
                required
                placeholder="Số nhà, tên đường, phường/xã"
                value={newFieldData.address}
                onChange={(e) => setNewFieldData({ ...newFieldData, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Quận / Huyện *
                </label>
                <input
                  type="text"
                  required
                  value={newFieldData.district}
                  onChange={(e) => setNewFieldData({ ...newFieldData, district: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tỉnh / Thành phố *
                </label>
                <input
                  type="text"
                  required
                  value={newFieldData.city}
                  onChange={(e) => setNewFieldData({ ...newFieldData, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                rows={2}
                placeholder="Chất lượng mặt cỏ, hệ thống đèn chiếu sáng, tiện ích bãi đỗ xe..."
                value={newFieldData.description}
                onChange={(e) => setNewFieldData({ ...newFieldData, description: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white resize-none"
              />
            </div>

            {/* THÔNG TIN TÀI KHOẢN NGÂN HÀNG NHẬN TIỀN (VIETQR) */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-3 dark:bg-emerald-950/20 space-y-2.5">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
                <QrCode className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="font-bold text-xs">Tài khoản nhận tiền (Tạo VietQR trực tiếp)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Khách đặt sân này sẽ quét mã VietQR và tiền được chuyển thẳng vào tài khoản của bạn.
              </p>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ngân hàng thụ hưởng *
                </label>
                <select
                  value={newFieldData.bankName}
                  onChange={(e) => setNewFieldData({ ...newFieldData, bankName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-medium text-xs"
                >
                  <option value="MBBank">MB Bank - Ngân hàng Quân Đội</option>
                  <option value="Vietcombank">Vietcombank - Ngân hàng Ngoại Thương</option>
                  <option value="Techcombank">Techcombank - Ngân hàng Kỹ Thương</option>
                  <option value="VietinBank">VietinBank - Ngân hàng Công Thương</option>
                  <option value="BIDV">BIDV - Đầu tư và Phát triển</option>
                  <option value="ACB">ACB - Ngân hàng Á Châu</option>
                  <option value="VPBank">VPBank - Việt Nam Thịnh Vượng</option>
                  <option value="TPBank">TPBank - Tiên Phong</option>
                  <option value="Agribank">Agribank - Nông Nghiệp</option>
                  <option value="Sacombank">Sacombank - Sài Gòn Thương Tín</option>
                  <option value="HDBank">HDBank - Phát triển TP.HCM</option>
                  <option value="SHB">SHB - Sài Gòn Hà Nội</option>
                  <option value="MSB">MSB - Hàng Hải</option>
                  <option value="VIB">VIB - Quốc Tế</option>
                  <option value="OCB">OCB - Phương Đông</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Số tài khoản ngân hàng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0912345678"
                    value={newFieldData.bankAccountNumber || ""}
                    onChange={(e) => setNewFieldData({ ...newFieldData, bankAccountNumber: e.target.value.trim() })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 outline-none font-mono focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-semibold text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tên chủ tài khoản (in hoa) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NGUYEN VAN A"
                    value={newFieldData.bankAccountName || ""}
                    onChange={(e) => setNewFieldData({ ...newFieldData, bankAccountName: e.target.value.toUpperCase() })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 outline-none font-mono focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white uppercase font-semibold text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateFieldOpen(false)} disabled={isCreatingField}>
                Hủy
              </Button>
              <Button type="submit" isLoading={isCreatingField} loadingText="Đang gửi...">
                Gửi phê duyệt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
