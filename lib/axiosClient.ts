import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.energytransportx.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          
          if (refreshResponse.data.success) {
            // Store new tokens
            localStorage.setItem("access_token", refreshResponse.data.authorization.access_token);
            localStorage.setItem("refresh_token", refreshResponse.data.authorization.refresh_token);
            
            // Update authorization header and retry original request
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.authorization.access_token}`;
            return axiosClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error("Token refresh failed:", refreshError);
        if (typeof window !== "undefined") {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    
    // For other errors
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;