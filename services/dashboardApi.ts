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
    
    const response = await axiosClient.patch<UpdatePredictionResponse>(`/api/predictions/update/${id}`,
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
};