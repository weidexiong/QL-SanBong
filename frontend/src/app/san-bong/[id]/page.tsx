"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Star,
  Users,
  Calendar,
  Phone,
  ArrowRight,
  ChevronLeft,
  Share2,
  CheckCircle2,
  Wifi,
  Lightbulb,
  Car,
  Coffee,
  Shirt,
  Trophy,
} from "lucide-react";
import { getFieldDetailApi } from "@/lib/api/fields";
import { FieldResponseDto } from "@/types/field";
import { formatCurrency } from "@/lib/utils/currency";

export default function FieldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fieldId = Number(params.id);

  const [field, setField] = React.useState<FieldResponseDto | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!fieldId) return;

    getFieldDetailApi(fieldId)
      .then((data) => {
        setField(data);
        setSelectedImage(data.primaryImageUrl || (data.images?.[0]?.imageUrl ?? ""));
      })
      .catch((err) => {
        setError(err.message || "Không tìm thấy thông tin sân bóng");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fieldId]);

  // Ánh xạ icon tiện ích linh hoạt
  const renderFacilityIcon = (iconKey: string) => {
    switch (iconKey?.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "lightbulb":
        return <Lightbulb className="h-4 w-4" />;
      case "car":
        return <Car className="h-4 w-4" />;
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      case "shirt":
        return <Shirt className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-6xl p-6 space-y-6 flex-1">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="container mx-auto max-w-md p-12 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Không tìm thấy sân bóng</h2>
          <p className="text-xs text-slate-500">{error || "Sân bóng này không tồn tại hoặc đã ngừng hoạt động."}</p>
          <Link href="/san-bong">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              Quay lại danh sách sân
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = field.images && field.images.length > 0
    ? field.images.map((img) => img.imageUrl)
    : [field.primaryImageUrl || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* Breadcrumb quay lại */}
        <div className="flex items-center justify-between">
          <Link
            href="/san-bong"
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Danh sách sân bóng
          </Link>
        </div>

        {/* Gallery ảnh sân */}
        <div className="space-y-3">
          <div className="relative h-[320px] sm:h-[450px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 dark:border-slate-800 shadow-lg">
            <img
              src={selectedImage || allImages[0]}
              alt={field.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 flex space-x-2">
              <Badge className="bg-emerald-600 text-white font-bold shadow-md">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                {field.fieldTypeDisplayName || field.fieldType}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex items-center space-x-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-amber-400 backdrop-blur-xs shadow-md">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{field.ratingAverage?.toFixed(1) || "5.0"}</span>
              <span className="text-slate-400 text-[11px]">({field.totalReviews || 0} đánh giá)</span>
            </div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    selectedImage === img
                      ? "border-emerald-600 shadow-md scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Hình ảnh ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nội dung chi tiết sân & Hộp đặt sân */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin, Tiện ích, Mô tả */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {field.name}
              </h1>
              <p className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="mr-1.5 h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{field.address}, {field.district}, {field.city}</span>
              </p>
            </div>

            {/* Tiện ích sân bóng */}
            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tiện ích & Dịch vụ tại sân
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {field.facilities?.map((fac) => (
                  <div
                    key={fac.id}
                    className="flex items-center space-x-2.5 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                      {renderFacilityIcon(fac.iconKey)}
                    </div>
                    <span>{fac.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mô tả sân bóng */}
            <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Giới thiệu chi tiết
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {field.description || "Sân cỏ nhân tạo chất lượng tiêu chuẩn, hệ thống thoát nước thông minh và đèn chiếu sáng hiện đại phục vụ các trận đấu ban đêm."}
              </p>
            </div>

            {/* Thông tin chủ sân */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs text-slate-400">Quản lý bởi đối tác chủ sân</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{field.ownerName || "Ban quản lý sân"}</p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
                <Phone className="h-4 w-4" />
                <span>{field.ownerPhone || "1900 8888"}</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Hộp CTA Đặt sân nổi bật */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-emerald-500/30 bg-white p-6 shadow-xl dark:border-emerald-500/20 dark:bg-slate-900 space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Giá thuê sân từ</span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(field.basePrice)}
                  </span>
                  <span className="text-xs text-slate-500">/ trận</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cam kết đúng giá niêm yết, không phụ thu ẩn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Xác nhận lịch đặt tức thì qua thông báo & SMS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Hỗ trợ hủy hoặc đổi lịch linh hoạt trước 4 tiếng</span>
                </div>
              </div>

              <Link href={`/dat-san/${field.id}`} className="block">
                <Button size="lg" className="w-full rounded-2xl py-6 text-base font-extrabold shadow-lg shadow-emerald-600/30">
                  <Calendar className="mr-2 h-5 w-5" />
                  Chọn ngày & Đặt lịch ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
