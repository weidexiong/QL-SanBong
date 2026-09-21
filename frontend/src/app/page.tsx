"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FieldSearchBar } from "@/components/fields/field-search-bar";
import { FieldCard } from "@/components/fields/field-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Flame,
} from "lucide-react";
import { getFieldsApi } from "@/lib/api/fields";
import { FieldResponseDto } from "@/types/field";

export default function HomePage() {
  const [fields, setFields] = React.useState<FieldResponseDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Lấy trực tiếp danh sách sân bóng thật từ MySQL Backend
    getFieldsApi({ size: 6, sortBy: "ratingAverage", sortDir: "desc" })
      .then((res) => {
        setFields(res.content || []);
      })
      .catch((err) => {
        console.error("Không thể tải danh sách sân từ backend:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge Thông báo */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-300/80 bg-emerald-50/80 px-4 py-1.5 text-xs font-bold text-emerald-800 backdrop-blur-md dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Nền tảng đặt sân bóng đá hàng đầu Việt Nam</span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white leading-[1.15]">
              Tìm sân bóng, <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 bg-clip-text text-transparent">
                đặt lịch dễ dàng
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Hơn 500+ cụm sân bóng đá cỏ nhân tạo 5, 7, 11 người trên toàn quốc. Tra cứu khung giờ trống, xem bảng giá minh bạch và đặt sân trong 30 giây.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto pt-2">
            <FieldSearchBar />
          </div>

          {/* Highlight Stats */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">500+</span>
              <p className="text-xs font-semibold text-slate-500">Sân bóng đối tác</p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</span>
              <p className="text-xs font-semibold text-slate-500">Giữ sân uy tín</p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">30s</span>
              <p className="text-xs font-semibold text-slate-500">Hoàn tất đặt lịch</p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">4.9/5</span>
              <p className="text-xs font-semibold text-slate-500">Đánh giá hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sân Nổi Bật (Featured Fields) */}
      <section className="py-12 md:py-16 bg-white dark:bg-slate-950/60 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Flame className="h-4 w-4" />
                <span>Lựa chọn hàng đầu</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                Sân bóng nổi bật nhất
              </h2>
            </div>
            <Link href="/san-bong">
              <Button variant="outline" size="sm" className="rounded-xl">
                Xem tất cả sân
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 w-full rounded-3xl" />
              ))}
            </div>
          ) : fields.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => (
                <FieldCard key={field.id} field={field} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500">Chưa có sân bóng nào trên hệ thống.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cách Hoạt Động (How It Works) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Quy trình đơn giản
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Cách thức đặt sân trong 4 bước
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tiết kiệm thời gian gọi điện hỏi sân, mọi thông tin đều được hiển thị trực tuyến theo thời gian thực
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-left space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-base dark:bg-emerald-950 dark:text-emerald-300">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Tìm sân bóng</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Lọc sân theo khu vực, loại sân (5, 7, 11 người), mức giá và đánh giá của các đội bóng khác.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-left space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-base dark:bg-emerald-950 dark:text-emerald-300">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Chọn ngày & khung giờ</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Xem lịch trống trực quan theo ngày, chọn khung giờ vàng phù hợp với lịch tập của đội bạn.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-left space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-base dark:bg-emerald-950 dark:text-emerald-300">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Xác nhận & Thanh toán</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Kiểm tra thông tin chi tiết hóa đơn, quét mã VietQR chuyển khoản an toàn, không lo mất cọc.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-left space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-base dark:bg-emerald-950 dark:text-emerald-300">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Nhận mã vé & Vào sân</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Nhận mã vé đặt sân và thông báo tức thì. Chỉ việc mang giày đến sân và bắt đầu trận cầu rực lửa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Đối tác Chủ Sân */}
      <section className="py-12 bg-gradient-to-br from-emerald-900 to-teal-950 text-white relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bạn đang sở hữu cụm sân bóng đá?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              Gia nhập mạng lưới Sân Bóng Việt để tiếp cận hàng nghìn đội bóng trong khu vực, tự động hóa quản lý lịch và tăng doanh thu tối đa.
            </p>
          </div>
          <Link href="/dang-ky" className="shrink-0">
            <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold shadow-xl">
              Đăng ký hợp tác chủ sân
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
