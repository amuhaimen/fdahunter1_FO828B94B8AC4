'use client'
import React, { useState, useEffect, useMemo } from "react";  
import PageHeader from "../reusable/PageHeader";
import WinRateIcon from "../icons/dashboardHome/WinRateIcon";
import StaticsIcon from "../icons/sidebar/StaticsIcon";
import WalletIcon from "../icons/sidebar/WalletIcon";
import UsersIcon from "../icons/sidebar/UsersIcon";
import { ChartRadialStacked } from "./ChartRadialStacked";
import { SearchBar } from "../reusable/SearchBar";
import DynamicTable from "../reusable/DynamicTable";
import { PredictionColumn } from "../columns/PredictionColumn";
import DynamicPagination from "../reusable/DynamicPagination";
import { ChartBarMultiple } from "./ChartMultipleBar";
import CustomDropdown from "../reusable/CustomDropdown";
import {  dashboardApi, DashboardStats, Prediction } from "@/services/dashboardApi";
 

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
  status?: "up" | "down";
}

export default function DashboardHome() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [month, setMonth] = useState('January');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [predictionsError, setPredictionsError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monthOptions = [
    { label: 'last 6 month', value: 'Last 6 month' },
    { label: 'last 3 month', value: 'Last 3 month' },
  ]
  
  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getDashboardStats();
        if (response.success) {
          setDashboardStats(response.data);
          setError(null);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);
  
  // Fetch predictions data
  const fetchPredictions = async (page: number = 1, limit: number = 10) => {
    try {
      setPredictionsLoading(true);
      const response = await dashboardApi.getAllPredictions({
        page,
        limit,
        search: search || undefined,
      });
      
      if (response.success) {
        setPredictions(response.data);
        setPagination(response.pagination);
        setCurrentPage(response.pagination.currentPage);
        setItemsPerPage(response.pagination.itemsPerPage);
        setPredictionsError(null);
      } else {
        setPredictionsError(response.message);
      }
    } catch (err: any) {
      console.error("Error fetching predictions:", err);
      setPredictionsError(err.message || "Failed to load predictions");
    } finally {
      setPredictionsLoading(false);
    }
  };

  // Initial fetch of predictions
  useEffect(() => {
    fetchPredictions(currentPage, itemsPerPage);
  }, []);

  // Filter data based on search - Now using API search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== undefined) {
        fetchPredictions(1, itemsPerPage);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchPredictions(newPage, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchPredictions(1, newItemsPerPage);
  };
  
  // Dashboard stats cards data
  const statCardsData: StatCardProps[] = useMemo(() => {
    if (!dashboardStats) {
      // Return loading/skeleton data
      return [
        {
          title: "Overall Win Rate",
          value: loading ? "Loading..." : "0%",
          period: "vs last month",
          icon: <WinRateIcon />,
        },
        {
          title: "Active Predictions",
          value: loading ? "Loading..." : 0,
          period: "vs last month",
          icon: <StaticsIcon />,
        },
        {
          title: "Total Subscribers",
          value: loading ? "Loading..." : "0",
          period: "vs last month",
          icon: <WalletIcon />,
        },
        {
          title: "Monthly Revenue",
          value: loading ? "Loading..." : "$0",
          period: "vs last month",
          icon: <UsersIcon />,
        },
      ];
    }

    // Format values from API
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };

    const formatNumber = (value: number) => {
      return new Intl.NumberFormat('en-US').format(value);
    };

    const getStatusText = (status: "up" | "down") => {
      return status === "up" ? "vs last month ↑" : "vs last month ↓";
    };

    return [
      {
        title: "Overall Win Rate",
        value: `${dashboardStats.overall_win_rate.win_rate}%`,
        period: getStatusText(dashboardStats.overall_win_rate.status),
        icon: <WinRateIcon />,
        status: dashboardStats.overall_win_rate.status
      },
      {
        title: "Active Predictions",
        value: formatNumber(dashboardStats.active_predictions.current),
        period: getStatusText(dashboardStats.active_predictions.status),
        icon: <StaticsIcon />,
        status: dashboardStats.active_predictions.status
      },
      {
        title: "Total Subscribers",
        value: formatNumber(dashboardStats.total_subscribers.total),
        period: getStatusText(dashboardStats.total_subscribers.status),
        icon: <WalletIcon />,
        status: dashboardStats.total_subscribers.status
      },
      {
        title: "Monthly Revenue",
        value: formatCurrency(dashboardStats.monthly_revenue.value),
        period: getStatusText(dashboardStats.monthly_revenue.status),
        icon: <UsersIcon />,
        status: dashboardStats.monthly_revenue.status
      },
    ];
  }, [dashboardStats, loading]);
  
  const handleRefreshStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to refresh dashboard statistics");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-xl">
        <div className="flex justify-between items-start">
          <PageHeader
            title="Hi, Meyer"
            subtitle="This is your break down summaries so far"
            titleClass="text-2xl font-bold text-white"
            subtitleClass="text-[#687588] text-sm"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCardsData.map((card, index) => (
            <div
              className="p-3 relative border border-[#2B303B] rounded-xl overflow-hidden"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
                <h3 className="text-white text-base font-medium">{card.title}</h3>
              </div>
              <h2 className="text-white text-2xl font-medium my-3">{card.value}</h2>
              <p className={`text-sm font-medium ${
                card.status === 'up' ? 'text-green-400' : 
                card.status === 'down' ? 'text-red-400' : 
                'text-[#687588]'
              }`}>
                {card.period}
              </p>
              
              {/* Loading shimmer effect */}
              {loading && !dashboardStats && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Section with Pagination */}
      <div className="bg-[#0E121B] mt-4.5 p-6 rounded-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-white font-bold">Recent Predictions</h2>
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            className="max-w-md" 
            placeholder="Search Picks"
          />
        </div>
        
        <div className="mt-6">
          {predictionsError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{predictionsError}</p>
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
                columns={PredictionColumn}
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
              <p className="text-[#687588]">No predictions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}