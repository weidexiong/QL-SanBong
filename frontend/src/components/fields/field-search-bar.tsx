"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Users, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FieldSearchBarProps {
  initialKeyword?: string;
  initialCity?: string;
  initialFieldType?: string;
  onSearch?: (params: { keyword: string; city: string; fieldType: string }) => void;
}

export function FieldSearchBar({
  initialKeyword = "",
  initialCity = "",
  initialFieldType = "",
  onSearch,
}: FieldSearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = React.useState(initialKeyword);
  const [city, setCity] = React.useState(initialCity);
  const [fieldType, setFieldType] = React.useState(initialFieldType);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, city, fieldType });
    } else {
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.set("keyword", keyword);
      if (city) queryParams.set("city", city);
      if (fieldType) queryParams.set("fieldType", fieldType);
      router.push(`/san-bong?${queryParams.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
    >
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-12 items-center">
        {/* Từ khóa tìm kiếm */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tên sân bóng, quận huyện..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 h-12 bg-slate-50/50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 font-medium"
          />
        </div>

        {/* Tỉnh / Thành phố */}
        <div className="lg:col-span-3 relative">
          <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 font-medium"
          >
            <option value="">Tất cả khu vực</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Bình Dương">Bình Dương</option>
            <option value="Hải Phòng">Hải Phòng</option>
          </select>
        </div>

        {/* Loại sân */}
        <div className="lg:col-span-2 relative">
          <Users className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 font-medium"
          >
            <option value="">Mọi loại sân</option>
            <option value="SAN_5">Sân 5 người</option>
            <option value="SAN_7">Sân 7 người</option>
            <option value="SAN_11">Sân 11 người</option>
          </select>
        </div>

        {/* Nút tìm kiếm */}
        <div className="lg:col-span-2">
          <Button type="submit" size="lg" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-emerald-600/30">
            <Search className="mr-2 h-4 w-4" />
            Tìm sân
          </Button>
        </div>
      </div>
    </form>
  );
}
