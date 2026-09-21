"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import {
  getMyNotificationsApi,
  markNotificationAsReadApi,
  NotificationDto,
  NotificationType,
} from "@/lib/api/notifications";
import { formatDate } from "@/lib/utils/date";
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  CheckCheck,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function NotificationsPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [notifications, setNotifications] = React.useState<NotificationDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNotifications = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getMyNotificationsApi(0, 50);
      setNotifications(res.content || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách thông báo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, fetchNotifications]);

  // Đánh dấu 1 thông báo đã đọc
  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsReadApi(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => markNotificationAsReadApi(n.id)));
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      toast("Đã đánh dấu tất cả thông báo là đã đọc", "success");
    } catch (err: any) {
      toast("Không thể cập nhật trạng thái thông báo", "error");
    }
  };

  // Helper render icon theo loại thông báo
  const renderNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "BOOKING_CONFIRMED":
      case "PAYMENT_SUCCESS":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        );
      case "BOOKING_REJECTED":
      case "PAYMENT_FAILED":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <XCircle className="h-5 w-5" />
          </div>
        );
      case "BOOKING_CANCELLED":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
          </div>
        );
      case "BOOKING_COMPLETED":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <CheckCheck className="h-5 w-5" />
          </div>
        );
      case "BOOKING_CREATED":
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Calendar className="h-5 w-5" />
          </div>
        );
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-4xl p-8 text-center text-sm text-slate-500">
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
            Bạn cần đăng nhập để xem thông báo cập nhật về các đơn đặt sân bóng.
          </p>
          <Link href="/dang-nhap">
            <Button>Đăng nhập ngay</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-6 w-6 text-emerald-600" />
              Thông báo hệ thống
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cập nhật trạng thái đặt sân, xác nhận từ chủ sân và biến động giao dịch
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
                <CheckCheck className="h-4 w-4 mr-1 text-emerald-600" />
                Đọc tất cả ({unreadCount})
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={fetchNotifications} className="text-xs">
              <RefreshCw className="h-4 w-4 mr-1" />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error state (Requirement 19) */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 space-y-3">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchNotifications}>
              Thử lại
            </Button>
          </div>
        )}

        {/* Empty state (Requirement 20) */}
        {!isLoading && !error && notifications.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Bell className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Chưa có thông báo nào
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bạn chưa có thông báo mới nào từ hệ thống. Khi bạn đặt sân hoặc có cập nhật lịch thi đấu, thông báo sẽ xuất hiện ở đây.
            </p>
            <Link href="/san-bong">
              <Button className="mt-2">Tìm sân ngay</Button>
            </Link>
          </div>
        )}

        {/* Notifications list */}
        {!isLoading && !error && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={`relative flex items-start gap-4 rounded-2xl border p-4 transition-all cursor-pointer ${
                  item.isRead
                    ? "border-slate-200 bg-white hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/40"
                    : "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30"
                }`}
              >
                {/* Icon */}
                {renderNotificationIcon(item.type)}

                {/* Nội dung */}
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h2>
                    {!item.isRead && (
                      <Badge variant="success" className="h-5 px-1.5 text-[10px]">
                        Mới
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center text-[11px] text-slate-400 pt-1">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
