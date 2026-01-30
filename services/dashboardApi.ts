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

export interface PredictionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
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
      
      // Handle different error response structures
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Return error response
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
      
      throw errorResponse;
    }
  },


};


 

