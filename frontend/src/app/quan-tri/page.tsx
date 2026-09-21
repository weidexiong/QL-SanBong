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
  getAdminStatsApi,
  getAdminUsersApi,
  approveOwnerApi,
  rejectOwnerApi,
  toggleLockUserApi,
  getAdminFieldsApi,
  approveFieldApi,
  rejectFieldApi,
  getAdminBookingsApi,
  AdminDashboardStats,
  UserDto,
} from "@/lib/api/admin";
import { BookingResponseDto } from "@/types/booking";
import { FieldResponseDto, FieldStatus } from "@/types/field";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import {
  ShieldCheck,
  Users,
  Building2,
  Calendar,
  CircleDollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  RefreshCw,
  LayoutDashboard,
  ClipboardCheck,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<"overview" | "owners" | "fields" | "bookings">("overview");

  // Stats
  const [stats, setStats] = React.useState<AdminDashboardStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = React.useState(true);

  // Users / Owners
  const [users, setUsers] = React.useState<UserDto[]>([]);
  const [isUsersLoading, setIsUsersLoading] = React.useState(true);
  const [userRoleFilter, setUserRoleFilter] = React.useState<string>("ROLE_CHUSAN");

  // Fields
  const [fields, setFields] = React.useState<FieldResponseDto[]>([]);
  const [isFieldsLoading, setIsFieldsLoading] = React.useState(true);
  const [fieldStatusFilter, setFieldStatusFilter] = React.useState<string>("");

  // Bookings
  const [bookings, setBookings] = React.useState<BookingResponseDto[]>([]);
  const [isBookingsLoading, setIsBookingsLoading] = React.useState(true);

  // Confirmation Dialog Targets
  const [userActionTarget, setUserActionTarget] = React.useState<{
    user: UserDto;
    action: "approve" | "reject" | "toggle-lock";
  } | null>(null);
  const [isProcessingUserAction, setIsProcessingUserAction] = React.useState(false);

  const [fieldActionTarget, setFieldActionTarget] = React.useState<{
    field: FieldResponseDto;
    action: "approve" | "reject";
  } | null>(null);
  const [isProcessingFieldAction, setIsProcessingFieldAction] = React.useState(false);

  // Fetch initial data
  const fetchData = React.useCallback(async () => {
    try {
      setIsStatsLoading(true);
      setIsUsersLoading(true);
      setIsFieldsLoading(true);
      setIsBookingsLoading(true);

      const [statsRes, usersRes, fieldsRes, bookingsRes] = await Promise.all([
        getAdminStatsApi().catch(() => null),
        getAdminUsersApi(userRoleFilter || undefined, undefined, 0, 50).catch(() => ({ content: [] })),
        getAdminFieldsApi(fieldStatusFilter || undefined, 0, 50).catch(() => ({ content: [] })),
        getAdminBookingsApi(0, 50).catch(() => ({ content: [] })),
      ]);

      if (statsRes) setStats(statsRes);
      setUsers(usersRes.content || []);
      setFields(fieldsRes.content || []);
      setBookings(bookingsRes.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStatsLoading(false);
      setIsUsersLoading(false);
      setIsFieldsLoading(false);
      setIsBookingsLoading(false);
    }
  }, [userRoleFilter, fieldStatusFilter]);

  React.useEffect(() => {
    if (isAuthenticated && user?.role === "ROLE_ADMIN") {
      fetchData();
    }
  }, [isAuthenticated, user, fetchData]);

  // Xử lý phê duyệt / từ chối / khóa User hoặc Chủ sân (Requirement 48)
  const handleUserAction = async () => {
    if (!userActionTarget) return;
    try {
      setIsProcessingUserAction(true);
      const { user: targetUser, action } = userActionTarget;

      if (action === "approve") {
        await approveOwnerApi(targetUser.id);
        toast(`Đã phê duyệt tài khoản chủ sân ${targetUser.fullName}`, "success");
      } else if (action === "reject") {
        await rejectOwnerApi(targetUser.id);
        toast(`Đã từ chối tài khoản chủ sân ${targetUser.fullName}`, "info");
      } else if (action === "toggle-lock") {
        await toggleLockUserApi(targetUser.id);
        toast(`Đã cập nhật trạng thái tài khoản ${targetUser.fullName}`, "success");
      }

      setUserActionTarget(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Xử lý thao tác thất bại", "error");
    } finally {
      setIsProcessingUserAction(false);
    }
  };

  // Xử lý phê duyệt / từ chối Sân bóng (Requirement 49)
  const handleFieldAction = async () => {
    if (!fieldActionTarget) return;
    try {
      setIsProcessingFieldAction(true);
      const { field: targetField, action } = fieldActionTarget;

      if (action === "approve") {
        await approveFieldApi(targetField.id);
        toast(`Đã phê duyệt sân bóng ${targetField.name}`, "success");
      } else if (action === "reject") {
        await rejectFieldApi(targetField.id);
        toast(`Đã từ chối sân bóng ${targetField.name}`, "info");
      }

      setFieldActionTarget(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Xử lý phê duyệt sân thất bại", "error");
    } finally {
      setIsProcessingFieldAction(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-5xl p-8 text-center text-sm text-slate-500">
          Đang kiểm tra quyền quản trị...
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ROLE_ADMIN") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-md p-12 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Khu vực dành cho Quản trị viên</h2>
          <p className="text-xs text-slate-500">
            Bạn không có quyền truy cập trang quản trị này. Vui lòng đăng nhập với tài khoản ADMIN.
          </p>
          <Link href="/dang-nhap">
            <Button>Đăng nhập tài khoản Quản trị</Button>
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
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Trung tâm Quản trị Hệ thống
              </h1>
              <Badge variant="destructive" className="text-xs flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                ADMIN
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm duyệt đối tác chủ sân, thẩm định sân bóng mới và giám sát hoạt động đặt sân toàn sàn
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchData} className="text-xs">
              <RefreshCw className="h-4 w-4 mr-1" />
              Làm mới toàn bộ
            </Button>
          </div>
        </div>

        {/* 6 KPI Cards (Requirement 52) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {/* 1. Tổng User */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Khách hàng</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
              {isStatsLoading ? <Skeleton className="h-7 w-10" /> : stats?.totalUsers ?? 0}
            </div>
            <p className="text-[10px] text-slate-400">Tài khoản</p>
          </div>

          {/* 2. Tổng Chủ sân */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Chủ sân</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Building2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
              {isStatsLoading ? <Skeleton className="h-7 w-10" /> : stats?.totalOwners ?? 0}
            </div>
            <p className="text-[10px] text-slate-400">Đối tác sân</p>
          </div>

          {/* 3. Tổng Sân bóng */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Sân bóng</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Layers className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
              {isStatsLoading ? <Skeleton className="h-7 w-10" /> : stats?.totalFields ?? 0}
            </div>
            <p className="text-[10px] text-slate-400">Cụm sân đăng ký</p>
          </div>

          {/* 4. Tổng Lượt đặt */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Lượt đặt sân</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <Calendar className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
              {isStatsLoading ? <Skeleton className="h-7 w-10" /> : stats?.totalBookings ?? 0}
            </div>
            <p className="text-[10px] text-slate-400">Đơn trên sàn</p>
          </div>

          {/* 5. Doanh thu toàn sàn */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Doanh thu sàn</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <CircleDollarSign className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-base font-black text-purple-600 dark:text-purple-400 mt-1.5 truncate">
              {isStatsLoading ? <Skeleton className="h-7 w-16" /> : formatCurrency(stats?.totalRevenue ?? 0)}
            </div>
            <p className="text-[10px] text-slate-400">Trận hoàn thành</p>
          </div>

          {/* 6. Chờ duyệt */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Chờ duyệt</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1.5">
              {isStatsLoading ? (
                <Skeleton className="h-7 w-10" />
              ) : (
                (stats?.pendingFields ?? 0) + (stats?.pendingOwners ?? 0)
              )}
            </div>
            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
              {stats?.pendingFields ?? 0} sân / {stats?.pendingOwners ?? 0} chủ
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Requirement 13 & 14) */}
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "overview"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Tổng quan duyệt nhanh</span>
          </button>

          <button
            onClick={() => setActiveTab("owners")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "owners"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>Duyệt chủ sân ({(stats?.pendingOwners ?? 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab("fields")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "fields"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Duyệt sân bóng ({(stats?.pendingFields ?? 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === "bookings"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Toàn bộ đơn ({bookings.length})</span>
          </button>
        </div>

        {/* TAB 1: TỔNG QUAN DUYỆT NHANH */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Sân chờ duyệt */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-500" />
                  Sân bóng đang chờ phê duyệt ({fields.filter((f) => f.status === "PENDING_APPROVAL").length})
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("fields")} className="text-xs">
                  Xem tất cả sân
                </Button>
              </div>

              {fields.filter((f) => f.status === "PENDING_APPROVAL").length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                  Hiện không có sân bóng nào đang chờ duyệt.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fields
                    .filter((f) => f.status === "PENDING_APPROVAL")
                    .map((f) => (
                      <div
                        key={f.id}
                        className="rounded-2xl border border-amber-200 bg-amber-50/20 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/10 space-y-2.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {f.name}
                            </span>
                            <Badge variant="warning">Chờ duyệt</Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {f.address}, {f.district}
                          </p>
                          <p className="font-bold text-emerald-600 text-xs mt-1">
                            {formatCurrency(f.basePrice)} / trận
                          </p>
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            size="sm"
                            onClick={() => setFieldActionTarget({ field: f, action: "approve" })}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Duyệt
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setFieldActionTarget({ field: f, action: "reject" })}
                            className="h-7 text-xs"
                          >
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Chủ sân chờ duyệt */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Đối tác Chủ sân chờ phê duyệt ({users.filter((u) => u.status === "PENDING").length})
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("owners")} className="text-xs">
                  Xem tất cả chủ sân
                </Button>
              </div>

              {users.filter((u) => u.status === "PENDING").length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                  Hiện không có đối tác chủ sân nào đang chờ duyệt.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {users
                    .filter((u) => u.status === "PENDING")
                    .map((u) => (
                      <div
                        key={u.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">{u.fullName}</span>
                            <Badge variant="warning">Chờ duyệt</Badge>
                          </div>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                          <p className="text-[11px] text-slate-400">SĐT: {u.phone || "Chưa cập nhật"}</p>
                        </div>
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            size="sm"
                            onClick={() => setUserActionTarget({ user: u, action: "approve" })}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Phê duyệt
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setUserActionTarget({ user: u, action: "reject" })}
                            className="h-7 text-xs"
                          >
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ & KIỂM DUYỆT CHỦ SÂN (Requirement 48) */}
        {activeTab === "owners" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Danh sách tài khoản đối tác Chủ sân
              </h2>
            </div>

            {isUsersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Họ và tên</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Số điện thoại</th>
                      <th className="py-3 px-4">Ngày đăng ký</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {item.fullName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.email}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.phone || "—"}</td>
                        <td className="py-3 px-4 text-slate-500">{formatDate(item.createdAt)}</td>
                        <td className="py-3 px-4">
                          {item.status === "ACTIVE" ? (
                            <Badge variant="success">Hoạt động</Badge>
                          ) : item.status === "PENDING" ? (
                            <Badge variant="warning">Chờ duyệt</Badge>
                          ) : item.status === "LOCKED" ? (
                            <Badge variant="destructive">Đã khóa</Badge>
                          ) : (
                            <Badge variant="destructive">Từ chối</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {item.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setUserActionTarget({ user: item, action: "approve" })}
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Phê duyệt
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setUserActionTarget({ user: item, action: "reject" })}
                                className="h-7 text-xs"
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
                          {item.status !== "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setUserActionTarget({ user: item, action: "toggle-lock" })}
                              className={`h-7 text-xs ${
                                item.status === "LOCKED"
                                  ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                  : "text-rose-600 border-rose-200 hover:bg-rose-50"
                              }`}
                            >
                              {item.status === "LOCKED" ? (
                                <>
                                  <Unlock className="h-3 w-3 mr-1" />
                                  Mở khóa
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3 mr-1" />
                                  Khóa
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: KIỂM DUYỆT SÂN BÓNG (Requirement 49) */}
        {activeTab === "fields" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Kiểm duyệt và quản trị sân bóng toàn hệ thống
              </h2>
            </div>

            {isFieldsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Tên sân bóng</th>
                      <th className="py-3 px-4">Chủ sân</th>
                      <th className="py-3 px-4">Địa điểm</th>
                      <th className="py-3 px-4">Loại sân</th>
                      <th className="py-3 px-4">Giá cơ bản</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {fields.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-[180px] truncate">
                          {f.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {f.ownerName || "Chủ sân"}
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-[160px] truncate">
                          {f.address}, {f.district}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {f.fieldType === "SAN_5" ? "Sân 5" : f.fieldType === "SAN_7" ? "Sân 7" : "Sân 11"}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600">
                          {formatCurrency(f.basePrice)}
                        </td>
                        <td className="py-3 px-4">
                          {f.status === "ACTIVE" ? (
                            <Badge variant="success">Hoạt động</Badge>
                          ) : f.status === "PENDING_APPROVAL" ? (
                            <Badge variant="warning">Chờ duyệt</Badge>
                          ) : (
                            <Badge variant="destructive">Từ chối</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {f.status === "PENDING_APPROVAL" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setFieldActionTarget({ field: f, action: "approve" })}
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Phê duyệt
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setFieldActionTarget({ field: f, action: "reject" })}
                                className="h-7 text-xs"
                              >
                                Từ chối
                              </Button>
                            </>
                          )}
                          <Link href={`/san-bong/${f.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Xem sân
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: XEM TOÀN BỘ BOOKINGS TRÊN HỆ THỐNG */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Toàn bộ đơn đặt sân trên nền tảng
              </h2>
              <span className="text-xs text-slate-500">Tổng cộng {bookings.length} đơn</span>
            </div>

            {isBookingsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Mã đơn</th>
                      <th className="py-3 px-4">Khách hàng</th>
                      <th className="py-3 px-4">Sân bóng</th>
                      <th className="py-3 px-4">Ngày</th>
                      <th className="py-3 px-4">Giờ</th>
                      <th className="py-3 px-4">Tổng tiền</th>
                      <th className="py-3 px-4">Trạng thái</th>
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
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-[160px] truncate">
                          {item.fieldName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{formatDate(item.bookingDate)}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {item.startTime} - {item.endTime}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600">
                          {formatCurrency(item.totalPrice)}
                        </td>
                        <td className="py-3 px-4">
                          {item.status === "CONFIRMED" ? (
                            <Badge variant="success">Đã xác nhận</Badge>
                          ) : item.status === "PENDING" ? (
                            <Badge variant="warning">Chờ duyệt</Badge>
                          ) : item.status === "COMPLETED" ? (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Hoàn thành</Badge>
                          ) : (
                            <Badge variant="destructive">Đã hủy/Từ chối</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CONFIRM DIALOG USER ACTION (Requirement 22) */}
      <Dialog open={!!userActionTarget} onOpenChange={(open) => !open && setUserActionTarget(null)}>
        <DialogContent onClose={() => setUserActionTarget(null)}>
          <DialogHeader>
            <DialogTitle>
              {userActionTarget?.action === "approve"
                ? "Phê duyệt đối tác Chủ sân"
                : userActionTarget?.action === "reject"
                ? "Từ chối đối tác Chủ sân"
                : "Cập nhật trạng thái khóa tài khoản"}
            </DialogTitle>
            <DialogDescription>
              {userActionTarget?.action === "approve" && (
                <>Phê duyệt tài khoản chủ sân cho <strong>{userActionTarget.user.fullName}</strong> ({userActionTarget.user.email})? Sau khi duyệt, chủ sân sẽ được phép tạo và đăng tải sân bóng.</>
              )}
              {userActionTarget?.action === "reject" && (
                <>Từ chối tài khoản đối tác của <strong>{userActionTarget.user.fullName}</strong> ({userActionTarget.user.email})?</>
              )}
              {userActionTarget?.action === "toggle-lock" && (
                <>Bạn có chắc muốn chuyển trạng thái tài khoản của <strong>{userActionTarget.user.fullName}</strong>?</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserActionTarget(null)} disabled={isProcessingUserAction}>
              Quay lại
            </Button>
            <Button
              variant={userActionTarget?.action === "reject" ? "destructive" : "default"}
              isLoading={isProcessingUserAction}
              loadingText="Đang xử lý..."
              onClick={handleUserAction}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DIALOG FIELD ACTION (Requirement 22) */}
      <Dialog open={!!fieldActionTarget} onOpenChange={(open) => !open && setFieldActionTarget(null)}>
        <DialogContent onClose={() => setFieldActionTarget(null)}>
          <DialogHeader>
            <DialogTitle>
              {fieldActionTarget?.action === "approve" ? "Phê duyệt sân bóng" : "Từ chối phê duyệt sân bóng"}
            </DialogTitle>
            <DialogDescription>
              {fieldActionTarget?.action === "approve" && (
                <>Phê duyệt sân bóng <strong>{fieldActionTarget.field.name}</strong> sang trạng thái ACTIVE? Sân sẽ lập tức hiển thị công khai trên hệ thống cho người dùng đặt lịch.</>
              )}
              {fieldActionTarget?.action === "reject" && (
                <>Từ chối sân bóng <strong>{fieldActionTarget.field.name}</strong>? Sân sẽ không được hiển thị cho khách hàng.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldActionTarget(null)} disabled={isProcessingFieldAction}>
              Quay lại
            </Button>
            <Button
              variant={fieldActionTarget?.action === "reject" ? "destructive" : "default"}
              isLoading={isProcessingFieldAction}
              loadingText="Đang xử lý..."
              onClick={handleFieldAction}
            >
              {fieldActionTarget?.action === "approve" ? "Phê duyệt" : "Từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
