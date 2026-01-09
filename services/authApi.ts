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
  message: string | { message: string; error: string; statusCode: number };
  authorization?: Authorization;
  type?: "admin" | "user";
}

// ============ ONLY LOGIN FUNCTION ============
const authApi = {
  // Login - Handle nested error response
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post<LoginResponse>("/api/auth/login", credentials);
      
      // Store tokens in localStorage if success
      if (typeof window !== "undefined" && response.data.success) {
        localStorage.setItem("access_token", response.data.authorization!.access_token);
        localStorage.setItem("refresh_token", response.data.authorization!.refresh_token);
        localStorage.setItem("user_type", response.data.type!);
        localStorage.setItem("user_email", credentials.email);
      }
      
      return response.data;
    } catch (error: any) {
      console.log("Raw API Error:", error);
      
      // FIXED: Handle nested error message structure
      let errorMessage = "Login failed. Please try again.";
      
      // Case 1: API returns nested error message (your case)
      if (error.response?.data?.message?.message) {
        errorMessage = error.response.data.message.message;
      }
      // Case 2: API returns simple error message
      else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      // Case 3: API returns error in different field
      else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      // Case 4: Axios error with message
      else if (error.message) {
        errorMessage = error.message;
      }
      
      // Create a proper error response object
      const errorResponse: LoginResponse = {
        success: false,
        message: errorMessage
      };
      
      throw errorResponse;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },

  // Get user type
  getUserType: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_type");
  },

  // Get user email
  getUserEmail: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("user_email");
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_email");
    }
  },
};

export default authApi;