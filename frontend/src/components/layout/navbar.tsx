"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Search,
  User,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Bell,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const isDark = (resolvedTheme || theme) === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  const navLinks = [
    { href: "/san-bong", label: "Tìm sân", icon: Search },
    { href: "/lich-dat", label: "Lịch đặt của tôi", icon: Calendar, requiresAuth: true },
    ...(user?.role === "ROLE_CHUSAN"
      ? [{ href: "/chu-san", label: "Quản lý sân", icon: Building2, requiresAuth: true }]
      : []),
    ...(user?.role === "ROLE_ADMIN"
      ? [{ href: "/quan-tri", label: "Quản trị", icon: ShieldCheck, requiresAuth: true }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              SÂN BÓNG <span className="text-emerald-600 dark:text-emerald-400">VIỆT</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest -mt-1">
              Đặt sân bóng đá thông minh
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            if (link.requiresAuth && !isAuthenticated) return null;
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle, Notifications, User Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Chuyển đổi giao diện Sáng/Tối"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {(resolvedTheme || theme) === "dark" ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600" />
              )}
            </button>
          )}

          {isAuthenticated && (
            <Link
              href="/thong-bao"
              aria-label="Thông báo"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
            </Link>
          )}

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {user.role === "ROLE_ADMIN" ? "Quản trị viên" : user.role === "ROLE_CHUSAN" ? "Chủ sân" : "Khách hàng"}
                </span>
              </div>
              <button
                onClick={logout}
                aria-label="Đăng xuất"
                title="Đăng xuất"
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/dang-nhap">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/dang-ky">
                <Button size="sm">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-1">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Chuyển đổi giao diện"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Mở menu điều hướng"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Sheet) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-xl dark:border-slate-800 dark:bg-slate-950 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1.5 pt-2">
            {navLinks.map((link) => {
              if (link.requiresAuth && !isAuthenticated) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Icon className="h-4 w-4 text-emerald-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <User className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/dang-nhap" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/dang-ky" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Theme Switcher */}
              {mounted && (
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900 mt-3">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Giao diện: {(resolvedTheme || theme) === "dark" ? "Chế độ Tối" : "Chế độ Sáng"}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    {(resolvedTheme || theme) === "dark" ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-amber-500 mr-1" />
                        <span>Chuyển Sáng</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5 text-indigo-600 mr-1" />
                        <span>Chuyển Tối</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
