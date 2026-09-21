import Link from "next/link";
import { MapPin, Phone, Mail, Sparkles, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Slogan */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                SÂN BÓNG <span className="text-emerald-600 dark:text-emerald-400">VIỆT</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nền tảng đặt sân bóng đá trực tuyến hàng đầu Việt Nam. Kết nối các đội bóng phong trào với hệ thống sân cỏ nhân tạo hiện đại.
            </p>
          </div>

          {/* Dành cho Khách hàng */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Khách đặt sân
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/san-bong" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Tìm sân bóng gần nhất
                </Link>
              </li>
              <li>
                <Link href="/lich-dat" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Quản lý lịch đặt sân
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Chính sách hoàn tiền & hủy lịch</span>
              </li>
              <li>
                <span className="text-slate-400">Quy tắc ứng xử trên sân</span>
              </li>
            </ul>
          </div>

          {/* Dành cho Chủ sân */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Dành cho Chủ sân
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/dang-ky" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Đăng ký hợp tác chủ sân
                </Link>
              </li>
              <li>
                <Link href="/chu-san" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Phần mềm quản lý sân bóng
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Báo cáo doanh thu thời gian thực</span>
              </li>
              <li>
                <span className="text-slate-400">Tối ưu công suất khung giờ trống</span>
              </li>
            </ul>
          </div>

          {/* Liên hệ & Hỗ trợ */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Hỗ trợ & Liên hệ
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Hotline: 1900 8888 (08:00 - 22:00)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>hotro@sanbongviet.vn</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Hà Nội & TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center space-x-2 pt-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Bảo đảm giữ sân 100% khi thanh toán</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 dark:border-slate-800">
          <p>© 2026 Sân Bóng Việt. Bản quyền thuộc về Hệ thống Đặt lịch & Quản lý Sân bóng đá Việt Nam.</p>
        </div>
      </div>
    </footer>
  );
}
