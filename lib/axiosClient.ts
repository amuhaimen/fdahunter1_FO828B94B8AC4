import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://192.168.7.12:4000",
  //  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.7.102:4010",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - SIMPLIFIED
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // FIXED: Better error logging
    console.error(" Axios Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      }
    });

    // Return the error as-is so authApi can handle it
    return Promise.reject(error);
  }
);

export default axiosClient;