import axiosClient from "@/lib/axiosClient";

// ============ TYPES ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface Authorization {
  type: string;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  authorization: Authorization;
  type: "admin" | "user";
}

export interface User {
  id: string;
  name: string;
  email: string;
  type?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  authorization?: Authorization;
}

// ============ AUTH API FUNCTIONS ============
const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post<LoginResponse>("/auth/login", credentials);
      
      // Store tokens in localStorage
      if (typeof window !== "undefined" && response.data.success) {
        localStorage.setItem("access_token", response.data.authorization.access_token);
        localStorage.setItem("refresh_token", response.data.authorization.refresh_token);
        localStorage.setItem("user_type", response.data.type);
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Register
  register: async (userData: any): Promise<ApiResponse> => {
    try {
      const response = await axiosClient.post<ApiResponse>("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await axiosClient.post<ApiResponse>("/auth/logout");
      
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_type");
        localStorage.removeItem("token");
      }
      
      return response.data;
    } catch (error: any) {
      // Clear storage even if API fails
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      throw error.response?.data || error.message;
    }
  },

  // Get User Profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await axiosClient.get<ApiResponse<User>>("/auth/profile");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh Token
  refreshToken: async (): Promise<ApiResponse> => {
    try {
      const refreshToken = typeof window !== "undefined" 
        ? localStorage.getItem("refresh_token") 
        : null;
      
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      
      const response = await axiosClient.post<ApiResponse>("/auth/refresh", {
        refresh_token: refreshToken
      });
      
      // Update tokens if refresh successful
      if (response.data.success && response.data.authorization) {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", response.data.authorization.access_token);
          localStorage.setItem("refresh_token", response.data.authorization.refresh_token);
        }
      }
      
      return response.data;
    } catch (error: any) {
      // Clear tokens if refresh fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
      throw error.response?.data || error.message;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },

  // Get current access token
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  // Get user type
  getUserType: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_type");
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("token");
    }
  },
};

// Export everything
export default authApi;
 