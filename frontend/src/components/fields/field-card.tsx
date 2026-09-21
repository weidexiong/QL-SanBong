import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Users, ArrowRight } from "lucide-react";
import { FieldResponseDto } from "@/types/field";
import { formatCurrency } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FieldCardProps {
  field: FieldResponseDto;
}

export function FieldCard({ field }: FieldCardProps) {
  // Ảnh mặc định chất lượng cao nếu sân chưa có ảnh
  const defaultImage = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80";
  const displayImage = field.primaryImageUrl || defaultImage;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Thumbnail Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={displayImage}
          alt={field.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Badge loại sân */}
        <div className="absolute top-3 left-3 flex space-x-1.5">
          <Badge className="bg-emerald-600 text-white font-bold shadow-md">
            <Users className="mr-1 h-3 w-3" />
            {field.fieldTypeDisplayName || field.fieldType}
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-xs shadow-md">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{field.ratingAverage?.toFixed(1) || "5.0"}</span>
          <span className="text-slate-400 text-[10px]">({field.totalReviews || 0})</span>
        </div>

        {/* Địa chỉ rút gọn trên ảnh */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="flex items-center text-xs font-medium text-slate-200 drop-shadow">
            <MapPin className="mr-1 h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{field.district}, {field.city}</span>
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <Link href={`/san-bong/${field.id}`}>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400">
            {field.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed dark:text-slate-400">
          {field.description || "Sân cỏ nhân tạo tiêu chuẩn thi đấu, trang bị đầy đủ tiện ích và hệ thống chiếu sáng ban đêm."}
        </p>

        {/* Tiện ích nổi bật (tối đa 3 tiện ích) */}
        {field.facilities && field.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {field.facilities.slice(0, 3).map((fac) => (
              <span
                key={fac.id}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {fac.name}
              </span>
            ))}
            {field.facilities.length > 3 && (
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800">
                +{field.facilities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Giá và Nút Đặt sân */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Giá chỉ từ</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(field.basePrice)}
            </span>
            <span className="text-[10px] text-slate-400"> / trận</span>
          </div>

          <Link href={`/dat-san/${field.id}`}>
            <Button size="sm" className="rounded-xl font-bold shadow-md shadow-emerald-600/20">
              Đặt sân
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
