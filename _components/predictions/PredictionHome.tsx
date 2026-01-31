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
import recentData from "../data/recentData.json";
import { dashboardApi, DashboardPredictionsResponse } from "@/services/dashboardApi";
 

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
  status?: "up" | "down";
  isLoading?: boolean;
}

export default function Prediction() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setSelectedCategories] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState<DashboardPredictionsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categoriesOption = [
    { value: "sports", label: "Sports" },
    { value: "stocks", label: "Stocks" },
    { value: "casino", label: "Casino" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  // Fetch dashboard predictions data
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

  // Filter data based on search term and filters
  const filteredData = useMemo(() => {
    let filtered = [...recentData];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sportsType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categories) {
      filtered = filtered.filter(item => 
        item.sportsType.toLowerCase() === categories.toLowerCase()
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(item => 
        item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    return filtered;
  }, [searchTerm, categories, statusFilter]);

  // Calculate pagination values
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get data for current page
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Check if there are next/previous pages
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };

  const handleAddPrediction = (newTestData: unknown) => {
    console.log("Adding new test:", newTestData);
    // Here you might want to refetch the dashboard stats after adding a new prediction
  };

  const handleOpenAddSidebar = () => {
    setIsAddSidebarOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
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
        </div>
        
        <div className="mt-6">
          {filteredData.length > 0 ? (
            <>
              <DynamicTable
                columns={RecentPredictionColumn}
                data={getCurrentPageData()} // Pass only current page data
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
              
              <div className=" ">
                <DynamicPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasNextPage={hasNextPage}
                  hasPrevPage={hasPrevPage}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  itemsPerPageOptions={[2, 5, 10, 15, 20, 25, 30, 50]}
                  showItemsPerPage={true}
                  show={totalItems > 0}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#687588]">No predictions found</p>
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