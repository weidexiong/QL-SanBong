import axios, { AxiosError } from "axios";

// Base URL cấu hình từ biến môi trường hoặc mặc định localhost:8080
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// Cấu hình axios instance trung tâm
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Interceptor đính kèm JWT Bearer token vào mỗi request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý response và refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Khi gặp mã lỗi 401 và chưa từng retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            // Gọi API làm mới access token
            const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshRes.data.data;

            localStorage.setItem("accessToken", newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          } catch (refreshErr) {
            // Refresh token thất bại hoặc hết hạn -> xóa token và chuyển hướng đăng nhập
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("currentUser");
            window.location.href = "/dang-nhap";
          }
        }
      }
    }

    // Trích xuất thông điệp lỗi thân thiện bằng tiếng Việt
    const resData = error.response?.data as any;
    const message = resData?.message || "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.";
    return Promise.reject(new Error(message));
  }
);
