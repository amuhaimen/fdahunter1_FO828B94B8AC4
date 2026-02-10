import axiosClient from "@/lib/axiosClient";

// ============ TYPES ============
export interface DashboardStats {
  overall_win_rate: {
    win_rate: number;
    last_month: number;
    status: "up" | "down";
  };
  active_predictions: {
    current: number;
    last_month: number;
    status: "up" | "down";
  };
  total_subscribers: {
    total: number;
    last_month: number;
    status: "up" | "down";
  };
  monthly_revenue: {
    value: number;
    last_month: number;
    status: "up" | "down";
  };
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

// predictions
export interface Prediction {
  id: string;
  category: string;
  status: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PredictionsResponse {
  success: boolean;
  message: string;
  data: Prediction[];
  pagination: PaginationInfo;
}

// Add interface for error response with valid categories
export interface PredictionsErrorResponse {
  success: false;
  message: string;
  validCategories?: string[];
}

export interface PredictionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

// ==========================================================
export interface DashboardPredictionsStats {
  total_records: {
    total_records: number;
    last_month: number;
    status: "up" | "down";
  };
  active_predictions: {
    current: number;
    last_month: number;
    status: "up" | "down";
  };
  total_win: {
    total_win: number;
    last_month: number;
    status: "up" | "down";
  };
  overall_win_rate: {
    win_rate: number;
    last_month: number;
    status: "up" | "down";
  };
}

export interface DashboardPredictionsResponse {
  success: boolean;
  message: string;
  data: DashboardPredictionsStats;
}

// =========================================================
export interface CreatePredictionRequest {
  category: string;
  description: string;
  image?: File; // Optional, only for Casino category
}

export interface CreatePredictionResponse {
  success: boolean;
  message: string;
  data: Prediction;
}

export interface UpdatePredictionRequest {
  description?: string;
  status?: string;
  image?: File | string; // Can be File for upload or string URL
}

export interface UpdatePredictionResponse {
  success: boolean;
  message: string;
  data: Prediction;
}

// ============ SUBSCRIPTION TYPES ============
export interface SubscriptionPackage {
  id: string;
  name: string;
  title: string;
  description: string[];
  amount: number;
  currency: string;
  duration: string;
  stripeProductId: string;
  stripePriceId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPackageRequest {
  name: string;
  title: string;
  description: string; // Will be split by commas to create array
  amount: number;
  duration: string; // Duration in days as string
}

export interface CreateSubscriptionPackageResponse {
  success: boolean;
  message: string;
  data: SubscriptionPackage;
}

export interface GetSubscriptionPackageResponse {
  success: boolean;
  message: string;
  data: SubscriptionPackage;
}
// ======================== promo code types ========================

// Add these interfaces to your dashboardApi.ts file

// ============ PROMO CODE TYPES ============
export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  stripeCouponId: string | null;
  stripePromotionCodeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromoCodeListResponse {
  success: boolean;
  message: string;
  data: PromoCode[];
}

export interface CreatePromoCodeRequest {
  code: string;
  discount: number | string;
  maxUses: number | string;
  expiresAt?: string;
}

export interface CreatePromoCodeResponse {
  success: boolean;
  message: string;
  data: PromoCode;
}

export interface DeletePromoCodeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
}

export interface UsersStats {
  totalUsersTrend: string;
  activeUsersTrend: string;
  promoUsersTrend: string;
  newUsersToday: number;
}

export interface UsersStatsResponse {
  success: boolean;
  message: string;
  data: UsersStats;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar: string | null;
  status: string;
  plan: string;
  amount: number;
  promoCode: string;
  isSubscriber: boolean;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: PaginationInfo;
}

// ============ DASHBOARD API FUNCTIONS ============
export const dashboardApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardResponse> => {
    try {
      const response = await axiosClient.get<DashboardResponse>("/api/dashboard/info");
      return response.data;
    } catch (error: any) {
      console.log("Dashboard API Error:", error);
      
      let errorMessage = "Failed to fetch dashboard statistics.";
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Return error response with default data
      const errorResponse: DashboardResponse = {
        success: false,
        message: errorMessage,
        data: {
          overall_win_rate: { win_rate: 0, last_month: 0, status: "down" },
          active_predictions: { current: 0, last_month: 0, status: "down" },
          total_subscribers: { total: 0, last_month: 0, status: "down" },
          monthly_revenue: { value: 0, last_month: 0, status: "down" }
        }
      };
      
      throw errorResponse;
    }
  },

  getAllPredictions: async (params?: PredictionsParams): Promise<PredictionsResponse> => {
    try {
      const response = await axiosClient.get<PredictionsResponse>("/api/predictions/get-all", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search,
          status: params?.status,
          category: params?.category,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("Predictions API Error:", error);
      
      let errorMessage = "Failed to fetch predictions.";
      let validCategories: string[] = [];
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Check if this is an invalid category error
        if (error.response.data.validCategories) {
          // Add valid categories to the error message for better UX
          errorMessage += ` Valid categories are: ${error.response.data.validCategories.join(', ')}`;
          validCategories = error.response.data.validCategories;
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Create a custom error that includes the valid categories
      const customError = new Error(errorMessage) as any;
      customError.validCategories = validCategories;
      customError.isInvalidCategoryError = validCategories.length > 0;
      
      // Return error response with custom error
      const errorResponse: PredictionsResponse = {
        success: false,
        message: errorMessage,
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: params?.page || 1,
          itemsPerPage: params?.limit || 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
      
      // Throw the custom error with additional info
      throw customError;
    }
  },

  getDashboardPredictionstats: async (): Promise<DashboardPredictionsResponse> => {
    try {
      const response = await axiosClient.get<DashboardPredictionsResponse>("/api/dashboard/predictions");
      return response.data;
    } catch (error: any) {
      console.log("Dashboard Predictions API Error:", error);
      
      let errorMessage = "Failed to fetch dashboard predictions statistics.";
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Return error response with default data
      const errorResponse: DashboardPredictionsResponse = {
        success: false,
        message: errorMessage,
        data: {
          total_records: { total_records: 0, last_month: 0, status: "down" },
          active_predictions: { current: 0, last_month: 0, status: "down" },
          total_win: { total_win: 0, last_month: 0, status: "down" },
          overall_win_rate: { win_rate: 0, last_month: 0, status: "down" }
        }
      };
      
      throw errorResponse;
    }
  },

  // Create new prediction
  createPrediction: async (data: CreatePredictionRequest): Promise<CreatePredictionResponse> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Required fields
      formData.append('category', data.category);
      formData.append('description', data.description);
      
      // Only append image if provided (for Casino category)
      if (data.image instanceof File) {
        formData.append('image', data.image);
      } else if (data.image && typeof data.image === 'string') {
        // If it's a string (base64 or URL), append as string
        formData.append('image', data.image);
      }
      
      const response = await axiosClient.post<CreatePredictionResponse>(
        "/api/predictions/create",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.log("Create Prediction API Error:", error);
      
      let errorMessage = "Failed to create prediction.";
      let validCategories: string[] = [];
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Check if this is an invalid category error
        if (error.response.data.validCategories) {
          errorMessage += ` Valid categories are: ${error.response.data.validCategories.join(', ')}`;
          validCategories = error.response.data.validCategories;
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Create a custom error that includes the valid categories
      const customError = new Error(errorMessage) as any;
      customError.validCategories = validCategories;
      customError.isInvalidCategoryError = validCategories.length > 0;
      
      // Return structured error response
      const errorResponse: CreatePredictionResponse = {
        success: false,
        message: errorMessage,
        data: {
          id: "",
          category: data.category,
          status: "pending",
          description: data.description,
          image: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      throw customError;
    }
  },

  updatePrediction: async (id: string, data: UpdatePredictionRequest): Promise<UpdatePredictionResponse> => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      if (data.status) {
        formData.append('status', data.status);
      }
      
      if (data.image instanceof File) {
        formData.append('image', data.image);
      } else if (data.image && typeof data.image === 'string') {
        formData.append('image', data.image);
      }
      
      const response = await axiosClient.patch<UpdatePredictionResponse>(
        `/api/predictions/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.log("Update Prediction API Error:", error);
      
      let errorMessage = "Failed to update prediction.";
      let validStatuses: string[] = [];
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Check if this is an invalid status error
        if (error.response.data.validStatuses) {
          errorMessage += ` Valid statuses are: ${error.response.data.validStatuses.join(', ')}`;
          validStatuses = error.response.data.validStatuses;
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Create a custom error that includes the valid statuses
      const customError = new Error(errorMessage) as any;
      customError.validStatuses = validStatuses;
      customError.isInvalidStatusError = validStatuses.length > 0;
      
      throw customError;
    }
  },

  // ============ SUBSCRIPTION API FUNCTIONS ============
  
  // Get subscription package
  getSubscriptionPackage: async (): Promise<GetSubscriptionPackageResponse> => {
    try {
      const response = await axiosClient.get<GetSubscriptionPackageResponse>("/api/subscription/package");
      return response.data;
    } catch (error: any) {
      console.log("Get Subscription Package API Error:", error);
      
      let errorMessage = "Failed to fetch subscription package.";
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Return error response
      const errorResponse: GetSubscriptionPackageResponse = {
        success: false,
        message: errorMessage,
        data: {
          id: "",
          name: "",
          title: "",
          description: [],
          amount: 0,
          currency: "usd",
          duration: "",
          stripeProductId: "",
          stripePriceId: "",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      throw errorResponse;
    }
  },

  // Create new subscription package
  createSubscriptionPackage: async (data: CreateSubscriptionPackageRequest): Promise<CreateSubscriptionPackageResponse> => {
    try {
      const response = await axiosClient.post<CreateSubscriptionPackageResponse>(
        "/api/subscription/package",
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.log("Create Subscription Package API Error:", error);
      
      let errorMessage = "Failed to create subscription package.";
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Create a custom error
      const customError = new Error(errorMessage) as any;
      
      // Return structured error response
      const errorResponse: CreateSubscriptionPackageResponse = {
        success: false,
        message: errorMessage,
        data: {
          id: "",
          name: data.name,
          title: data.title,
          description: [data.description],
          amount: data.amount,
          currency: "usd",
          duration: data.duration,
          stripeProductId: "",
          stripePriceId: "",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      throw customError;
    }
  },

  getPromoCodes: async (): Promise<PromoCodeListResponse> => {
  try {
    const response = await axiosClient.get<PromoCodeListResponse>("/api/subscription/promo-code");
    return response.data;
  } catch (error: any) {
    console.log("Get Promo Codes API Error:", error);
    
    let errorMessage = "Failed to fetch promo codes.";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    const errorResponse: PromoCodeListResponse = {
      success: false,
      message: errorMessage,
      data: []
    };
    
    throw errorResponse;
  }
},

// Create new promo code
createPromoCode: async (data: CreatePromoCodeRequest): Promise<CreatePromoCodeResponse> => {
  try {
    const response = await axiosClient.post<CreatePromoCodeResponse>(
      "/api/subscription/promo-code",
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.log("Create Promo Code API Error:", error);
    
    let errorMessage = "Failed to create promo code.";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    const customError = new Error(errorMessage) as any;
    
    const errorResponse: CreatePromoCodeResponse = {
      success: false,
      message: errorMessage,
      data: {
        id: "",
        code: data.code,
        discount: typeof data.discount === 'string' ? parseInt(data.discount) : data.discount,
        maxUses: typeof data.maxUses === 'string' ? parseInt(data.maxUses) : data.maxUses,
        usedCount: 0,
        isActive: true,
        expiresAt: data.expiresAt || null,
        stripeCouponId: null,
        stripePromotionCodeId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    throw customError;
  }
},

// Delete promo code
deletePromoCode: async (id: string): Promise<DeletePromoCodeResponse> => {
  try {
    const response = await axiosClient.delete<DeletePromoCodeResponse>(
      `/api/subscription/promo-code/${id}`
    );
    
    return response.data;
  } catch (error: any) {
    console.log("Delete Promo Code API Error:", error);
    
    let errorMessage = "Failed to delete promo code.";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    const customError = new Error(errorMessage) as any;
    
    const errorResponse: DeletePromoCodeResponse = {
      success: false,
      message: errorMessage,
      data: {
        id: id
      }
    };
    
    throw customError;
  }
},

// Add this function to the dashboardApi object

  // Get users statistics
  getUsersStats: async (): Promise<UsersStatsResponse> => {
    try {
      const response = await axiosClient.get<UsersStatsResponse>("/api/users/stats");
      return response.data;
    } catch (error: any) {
      console.log("Users Stats API Error:", error);
      
      let errorMessage = "Failed to fetch users statistics.";
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Return error response with default data
      const errorResponse: UsersStatsResponse = {
        success: false,
        message: errorMessage,
        data: {
          totalUsersTrend: "0",
          activeUsersTrend: "0",
          promoUsersTrend: "0",
          newUsersToday: 0
        }
      };
      
      throw errorResponse;
    }
  },

  // Add to the dashboardApi object in dashboardApi.ts

  // Get all users with pagination
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    promoCode?: string;
  }): Promise<UsersListResponse> => {
    try {
      const response = await axiosClient.get<UsersListResponse>("/api/users/all", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search,
          status: params?.status,
          promoCode: params?.promoCode,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("Users API Error:", error);
      
      let errorMessage = "Failed to fetch users.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      const errorResponse: UsersListResponse = {
        success: false,
        message: errorMessage,
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: params?.page || 1,
          itemsPerPage: params?.limit || 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
      
      throw errorResponse;
    }
  },

};