"use client";
import React, { useState, useMemo, useEffect } from "react";
import PageHeader from "../reusable/PageHeader";
import TotalRecordsIcon from "../icons/predictions/TotalRecordsIcon";
import ActivePredictionIcon from "../icons/predictions/ActivePredictionIcon";
import TotalWin from "../icons/predictions/TotalWin";
import OverAllWinIcon from "../icons/predictions/OverAllWinIcon";
import PlusIcon from "../icons/predictions/PlusIcon";
import { SearchBar } from "../reusable/SearchBar";
import CustomDropdown from "../reusable/CustomDropdown";
import AddPredictionSidebar from "./AddPredictionSidebar";
import DynamicTable from "../reusable/DynamicTable";
import DynamicPagination from "../reusable/DynamicPagination";
import { RecentPredictionColumn } from "../columns/RecentPredictionsColumn";
import { dashboardApi } from "@/services/dashboardApi";
import type { DashboardPredictionsResponse, Prediction } from "@/services/dashboardApi";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
  status?: "up" | "down";
  isLoading?: boolean;
}

interface CategoryOption {
  value: string;
  label: string;
}

export default function Prediction() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setSelectedCategories] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [predictionsError, setPredictionsError] = useState<string | null>(null);
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState<DashboardPredictionsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category options from API
  const [categoriesOption, setCategoriesOption] = useState<CategoryOption[]>([
    { value: "Casino", label: "Casino" },
    { value: "Sports", label: "Sports" },
    { value: "Stocks", label: "Stocks" },
    { value: "Crypto", label: "Crypto" },
  ]);

  // Status options based on API response
  const statusOptions = [
    { value: "win", label: "Win" },
    { value: "lose", label: "Lose" },
    { value: "pending", label: "Pending" },
    { value: "cancel", label: "Cancel" },
  ];

  // Fetch dashboard predictions stats data
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await dashboardApi.getDashboardPredictionstats();
        
        if (response.success) {
          setDashboardStats(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch dashboard statistics");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "Failed to load dashboard statistics");
        
        // Set fallback empty stats from the API's error response
        if (err.data) {
          setDashboardStats(err.data);
        } else {
          setDashboardStats({
            total_records: { total_records: 0, last_month: 0, status: "down" },
            active_predictions: { current: 0, last_month: 0, status: "down" },
            total_win: { total_win: 0, last_month: 0, status: "down" },
            overall_win_rate: { win_rate: 0, last_month: 0, status: "down" }
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch predictions data with proper API filtering
  const fetchPredictions = async (page: number = 1, limit: number = 10) => {
    try {
      setPredictionsLoading(true);
      const response = await dashboardApi.getAllPredictions({
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        category: categories || undefined,
      });
      
      if (response.success) {
        setPredictions(response.data);
        setPagination(response.pagination);
        setPredictionsError(null);
      } else {
        setPredictionsError(response.message);
      }
    } catch (err: any) {
      console.error("Error fetching predictions:", err);
      
      // Handle invalid category error specifically
      if (err.isInvalidCategoryError && err.validCategories) {
        // Update categories dropdown with valid categories from API
        const validCategories = err.validCategories.map((cat: string) => ({
          value: cat,
          label: cat
        }));
        setCategoriesOption(validCategories);
        
        // Reset category filter if it's invalid
        if (categories && !err.validCategories.includes(categories)) {
          setSelectedCategories("");
        }
        
        setPredictionsError(err.message);
      } else {
        setPredictionsError(err.message || "Failed to load predictions");
      }
      
      // Clear predictions on error
      setPredictions([]);
      setPagination({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      });
    } finally {
      setPredictionsLoading(false);
    }
  };

  // Initial fetch of predictions
  useEffect(() => {
    fetchPredictions(1, 10);
  }, []);

  // Debounced search - refetch when search term changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPredictions(1, pagination.itemsPerPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Refetch when category filter changes
  useEffect(() => {
    if (categories !== undefined) {
      fetchPredictions(1, pagination.itemsPerPage);
    }
  }, [categories]);

  // Refetch when status filter changes
  useEffect(() => {
    if (statusFilter !== undefined) {
      fetchPredictions(1, pagination.itemsPerPage);
    }
  }, [statusFilter]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    fetchPredictions(newPage, pagination.itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    fetchPredictions(1, newItemsPerPage);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories("");
    setStatusFilter("");
    fetchPredictions(1, pagination.itemsPerPage);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  // Format period text based on status
  const getStatusText = (status: "up" | "down") => {
    return status === "up" ? "vs last month ↑" : "vs last month ↓";
  };

  // Create stat cards data from API response
  const statCardsData: StatCardProps[] = useMemo(() => {
    if (!dashboardStats) {
      // Return loading/skeleton data
      return [
        {
          title: "Total Records",
          value: isLoading ? "Loading..." : 0,
          period: "vs last month",
          icon: <TotalRecordsIcon />,
          isLoading,
        },
        {
          title: "Active Predictions",
          value: isLoading ? "Loading..." : 0,
          period: "vs last month",
          icon: <ActivePredictionIcon />,
          isLoading,
        },
        {
          title: "Total Win",
          value: isLoading ? "Loading..." : 0,
          period: "vs last month",
          icon: <TotalWin />,
          isLoading,
        },
        {
          title: "Overall Win Rate",
          value: isLoading ? "Loading..." : "0%",
          period: "vs last month",
          icon: <OverAllWinIcon />,
          isLoading,
        },
      ];
    }
    
    // Format values from API
    const formatNumber = (value: number) => {
      return new Intl.NumberFormat('en-US').format(value);
    };

    return [
      {
        title: "Total Records",
        value: formatNumber(dashboardStats.total_records.total_records),
        period: getStatusText(dashboardStats.total_records.status),
        icon: <TotalRecordsIcon />,
        status: dashboardStats.total_records.status
      },
      {
        title: "Active Predictions",
        value: formatNumber(dashboardStats.active_predictions.current),
        period: getStatusText(dashboardStats.active_predictions.status),
        icon: <ActivePredictionIcon />,
        status: dashboardStats.active_predictions.status
      },
      {
        title: "Total Win",
        value: formatNumber(dashboardStats.total_win.total_win),
        period: getStatusText(dashboardStats.total_win.status),
        icon: <TotalWin />,
        status: dashboardStats.total_win.status
      },
      {
        title: "Overall Win Rate",
        value: formatPercentage(dashboardStats.overall_win_rate.win_rate),
        period: getStatusText(dashboardStats.overall_win_rate.status),
        icon: <OverAllWinIcon />,
        status: dashboardStats.overall_win_rate.status
      },
    ];
  }, [dashboardStats, isLoading]);

  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };

  const handleAddPrediction = (newTestData: unknown) => {
    console.log("Adding new test:", newTestData);
    // Refetch predictions after adding a new one
    fetchPredictions(pagination.currentPage, pagination.itemsPerPage);
  };

  const handleOpenAddSidebar = () => {
    setIsAddSidebarOpen(true);
  };

  // Refresh dashboard stats
  const handleRefreshStats = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardApi.getDashboardPredictionstats();
      if (response.success) {
        setDashboardStats(response.data);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to refresh dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-2xl">
        <PageHeader
          title="Predictions Management"
          subtitle="Manage all your predictions across categories"
        />
        
        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={handleRefreshStats}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        )}
        
        {/* Stats cards with API data */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCardsData.map((card, index) => (
            <div
              className={`p-3 relative border border-[#2B303B] rounded-xl overflow-hidden ${card.isLoading ? 'animate-pulse' : ''}`}
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
                <h3 className="text-white text-base font-medium">
                  {card.title}
                </h3>
              </div>
              <h2 className={`text-white text-2xl font-medium my-3 ${card.isLoading ? 'bg-gray-700 h-8 w-16 rounded animate-pulse' : ''}`}>
                {!card.isLoading && card.value}
              </h2>
              <p className={`text-sm font-medium ${
                card.status === 'up' ? 'text-green-400' : 
                card.status === 'down' ? 'text-red-400' : 
                'text-[#687588]'
              }`}>
                {card.period}
              </p>
              
              {/* Loading shimmer effect - similar to DashboardHome */}
              {card.isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-[#0E121B] p-6 rounded-2xl mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">Recent Predictions</h2>
          <button
            onClick={handleOpenAddSidebar}
            className="bg-[#00F474] text-base text-[#1D1F2C] font-semibold p-2 rounded-lg
                 cursor-pointer flex items-center gap-1 hover:bg-[#00F474]/90 transition active:scale-95"
          >
            <PlusIcon />
            Add new prediction
          </button>
        </div>
        
        <div className="mt-5 flex flex-col lg:flex-row items-center w-full gap-3.5">
          <SearchBar
            placeholder="Search Picks"
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1"
          />
          <CustomDropdown
            options={categoriesOption}
            value={categories}
            onChange={setSelectedCategories}
            placeholder="Select categories"
            className="flex-1 w-full"
          />
          <CustomDropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Select status"
            className="flex-1 w-full"
          />
          {(searchTerm || categories || statusFilter) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        <div className="mt-6">
          {predictionsError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{predictionsError}</p>
              {predictionsError.includes("Invalid category") && (
                <p className="text-yellow-400 text-sm mt-1">
                  Available categories: {categoriesOption.map(c => c.label).join(', ')}
                </p>
              )}
            </div>
          )}
          
          {predictionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading predictions...</p>
            </div>
          ) : predictions.length > 0 ? (
            <>
              <DynamicTable
                columns={RecentPredictionColumn}
                data={predictions}
                hasWrapperBorder={false}
                headerStyles={{
                  backgroundColor: "#323B49",
                  textColor: "#CBD5E0",
                  fontSize: "12px",
                  padding: "16px",
                  fontWeight: "600",
                }}
                roundedClass="rounded-b-none"
                minWidth={800}
                cellBorderColor="#323B49"
              />
              
              {/* Pagination Component */}
              <div className="mt-4">
                <DynamicPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onPageChange={handlePageChange}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  itemsPerPageOptions={[5, 10, 15, 20, 25, 30, 50]}
                  showItemsPerPage={true}
                  show={pagination.totalItems > 0}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#687588]">
                {predictionsError ? "Error loading predictions" : "No predictions found"}
              </p>
              {(searchTerm || categories || statusFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear filters to see all predictions
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AddPredictionSidebar
        isOpen={isAddSidebarOpen}
        onClose={handleCloseAddSidebar}
        onSave={handleAddPrediction}
      />
    </div>
  );
}