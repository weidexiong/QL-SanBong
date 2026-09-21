"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, Phone, User, Building2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import { registerApi } from "@/lib/api/auth";
import { UserRole } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const [role, setRole] = React.useState<UserRole>("ROLE_USER");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password) {
      toast("Vui lòng điền đầy đủ tất cả các trường thông tin", "error");
      return;
    }

    if (password !== confirmPassword) {
      toast("Mật khẩu xác nhận không trùng khớp", "error");
      return;
    }

    if (password.length < 6) {
      toast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return;
    }

    try {
      setIsLoading(true);
      const res = await registerApi({
        fullName,
        email,
        phone,
        password,
        role,
      });

      login(res.accessToken, res.refreshToken, res.user);

      if (role === "ROLE_CHUSAN") {
        toast("Đăng ký thành công! Hồ sơ chủ sân của bạn đang chờ Admin duyệt.", "info");
        router.push("/chu-san");
      } else {
        toast("Đăng ký tài khoản thành công!", "success");
        router.push("/san-bong");
      }
    } catch (err: any) {
      toast(err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tạo tài khoản mới
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tham gia cộng đồng bóng đá hoặc đưa sân bóng của bạn lên hệ thống
          </p>
        </div>

        <Card className="border-slate-200/80 shadow-xl dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
              <button
                type="button"
                onClick={() => setRole("ROLE_USER")}
                className={`flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  role === "ROLE_USER"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <User className="mr-1.5 h-3.5 w-3.5" />
                Khách đặt sân
              </button>
              <button
                type="button"
                onClick={() => setRole("ROLE_CHUSAN")}
                className={`flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  role === "ROLE_CHUSAN"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <Building2 className="mr-1.5 h-3.5 w-3.5" />
                Đối tác chủ sân
              </button>
            </div>
            <CardTitle className="text-base">
              {role === "ROLE_USER" ? "Đăng ký tài khoản Khách hàng" : "Đăng ký tài khoản Đối tác Chủ sân"}
            </CardTitle>
            <CardDescription className="text-xs">
              {role === "ROLE_USER"
                ? "Dễ dàng tìm kiếm và đặt lịch sân bóng gần nhất"
                : "Quản lý sân bóng, nhận đặt lịch trực tuyến và tăng doanh thu"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-3.5">
              {role === "ROLE_CHUSAN" && (
                <div className="flex items-start space-x-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Hồ sơ chủ sân sẽ ở trạng thái chờ duyệt. Quản trị viên sẽ kích hoạt sau khi kiểm tra thông tin.
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="tel"
                    placeholder="0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mật khẩu
                  </label>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingText="Đang tạo tài khoản..."
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Đăng ký tài khoản
              </Button>
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                Đã có tài khoản?{" "}
                <Link
                  href="/dang-nhap"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
