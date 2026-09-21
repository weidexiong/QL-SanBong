"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FieldCard } from "@/components/fields/field-card";
import { FieldSearchBar } from "@/components/fields/field-search-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { getFieldsApi } from "@/lib/api/fields";
import { FieldResponseDto, PageResponse } from "@/types/field";

function FieldsContent() {
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get("keyword") || "";
  const cityParam = searchParams.get("city") || "";
  const fieldTypeParam = (searchParams.get("fieldType") as any) || undefined;

  const [fields, setFields] = React.useState<FieldResponseDto[]>([]);
  const [pageData, setPageData] = React.useState<PageResponse<FieldResponseDto> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [currentPage, setCurrentPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("ratingAverage");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  // Bộ lọc hiện tại
  const [keyword, setKeyword] = React.useState(keywordParam);
  const [city, setCity] = React.useState(cityParam);
  const [fieldType, setFieldType] = React.useState<string | undefined>(fieldTypeParam);

  const fetchFields = React.useCallback(async (page = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getFieldsApi({
        keyword: keyword || undefined,
        city: city || undefined,
        fieldType: fieldType as any,
        page,
        size: 9,
        sortBy,
        sortDir,
      });
      setFields(res.content || []);
      setPageData(res);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách sân bóng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [keyword, city, fieldType, sortBy, sortDir]);

  React.useEffect(() => {
    fetchFields(0);
  }, [fetchFields]);

  const handleSearch = (params: { keyword: string; city: string; fieldType: string }) => {
    setKeyword(params.keyword);
    setCity(params.city);
    setFieldType(params.fieldType || undefined);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 flex-1">
        {/* Tiêu đề trang */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Danh sách sân bóng đá
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Tra cứu và lựa chọn cụm sân cỏ nhân tạo theo vị trí và nhu cầu của đội bạn
          </p>
        </div>

        {/* Thanh tìm kiếm */}
        <FieldSearchBar
          initialKeyword={keyword}
          initialCity={city}
          initialFieldType={fieldType}
          onSearch={handleSearch}
        />

        {/* Thanh sắp xếp và số lượng kết quả */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tìm thấy{" "}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {pageData?.totalElements || 0}
            </span>{" "}
            sân bóng đang hoạt động
          </div>

          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sắp xếp:</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split("-");
                setSortBy(sb);
                setSortDir(sd as any);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 font-medium"
            >
              <option value="ratingAverage-desc">Đánh giá cao nhất</option>
              <option value="basePrice-asc">Giá thấp đến cao</option>
              <option value="basePrice-desc">Giá cao đến thấp</option>
              <option value="createdAt-desc">Sân mới nhất</option>
            </select>
          </div>
        </div>

        {/* Trạng thái lỗi (Requirement 19: Error State có nút Thử lại) */}
        {error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20 space-y-3">
            <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchFields(currentPage)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          </div>
        )}

        {/* Trạng thái đang tải (Requirement 18: Skeleton Loading) */}
        {isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <div className="pt-2 flex justify-between">
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trạng thái trống (Requirement 20: Empty State kèm CTA) */}
        {!isLoading && !error && fields.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Không tìm thấy sân bóng phù hợp
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn tỉnh/thành phố khác để có nhiều kết quả hơn.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setKeyword("");
                setCity("");
                setFieldType(undefined);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}

        {/* Danh sách sân bóng */}
        {!isLoading && !error && fields.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}

        {/* Phân trang (Requirement 53: Pagination) */}
        {!isLoading && pageData && pageData.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => fetchFields(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trang trước
            </Button>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              Trang {currentPage + 1} / {pageData.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pageData.isLast}
              onClick={() => fetchFields(currentPage + 1)}
            >
              Trang sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function FieldsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Đang tải danh sách sân bóng...</div>}>
      <FieldsContent />
    </React.Suspense>
  );
}
