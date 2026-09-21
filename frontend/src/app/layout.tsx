import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sân Bóng Việt - Đặt Lịch & Quản Lý Sân Bóng Đá Toàn Quốc",
  description: "Hệ thống tìm kiếm, so sánh giá và đặt lịch sân bóng đá nhanh chóng, tiện lợi, giá tốt nhất trên toàn quốc.",
  keywords: "đặt sân bóng, thuê sân bóng, quản lý sân bóng, bóng đá mini, sân 7 người, sân 5 người, sân cỏ nhân tạo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
