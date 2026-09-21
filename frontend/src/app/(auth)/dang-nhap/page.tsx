"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Sparkles, Building2, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import { loginApi } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Vui lòng điền đầy đủ email và mật khẩu", "error");
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginApi({ email, password });
      login(res.accessToken, res.refreshToken, res.user);
      toast("Đăng nhập thành công! Chào mừng bạn quay trở lại.", "success");

      // Chuyển hướng theo vai trò
      if (res.user.role === "ROLE_ADMIN") {
        router.push("/quan-tri");
      } else if (res.user.role === "ROLE_CHUSAN") {
        router.push("/chu-san");
      } else {
        router.push("/san-bong");
      }
    } catch (err: any) {
      toast(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm chọn nhanh tài khoản demo
  const selectDemoAccount = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Đăng nhập hệ thống
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nhập email và mật khẩu để quản lý và đặt lịch sân bóng
          </p>
        </div>

        <Card className="border-slate-200/80 shadow-xl dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
            <CardDescription>
              Đăng nhập để xem lịch đặt và đặt sân nhanh chóng
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mật khẩu
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Hộp chọn nhanh tài khoản thử nghiệm */}
              <div className="rounded-xl border border-dashed border-emerald-300/80 bg-emerald-50/50 p-3 dark:border-emerald-800/80 dark:bg-emerald-950/20 space-y-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                  Tài khoản dùng thử (Bấm chọn nhanh):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => selectDemoAccount("user@football.vn", "User@123")}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium hover:border-emerald-500 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <User className="h-3.5 w-3.5 text-emerald-600 mb-1" />
                    <span>Khách hàng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDemoAccount("chusan@football.vn", "Chusan@123")}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium hover:border-emerald-500 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <Building2 className="h-3.5 w-3.5 text-amber-600 mb-1" />
                    <span>Chủ sân</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDemoAccount("admin@football.vn", "Admin@123")}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium hover:border-emerald-500 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 mb-1" />
                    <span>Quản trị viên</span>
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingText="Đang đăng nhập..."
              >
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập
              </Button>
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                Chưa có tài khoản?{" "}
                <Link
                  href="/dang-ky"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
