"use client";

import * as React from "react";
import { UserDto } from "@/types/auth";
import { apiClient } from "@/lib/api/client";

interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: UserDto) => void;
  logout: () => void;
  updateUser: (user: UserDto) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Khôi phục phiên đăng nhập khi tải trang
  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      const token = localStorage.getItem("accessToken");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        // Kiểm tra token với backend /auth/me
        apiClient
          .get("/auth/me")
          .then((res) => {
            if (res.data?.data) {
              setUser(res.data.data);
              localStorage.setItem("currentUser", JSON.stringify(res.data.data));
            }
          })
          .catch(() => {
            // Token hết hạn hoặc không hợp lệ -> để interceptor xử lý refresh
          });
      }
    } catch {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = React.useCallback((accessToken: string, refreshToken: string, userData: UserDto) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    setUser(null);
  }, []);

  const updateUser = React.useCallback((userData: UserDto) => {
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }),
    [user, isLoading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
}
