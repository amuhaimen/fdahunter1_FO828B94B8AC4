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
import predictionData from '../../_components/data/predictionData.json'
import DynamicPagination from "../reusable/DynamicPagination";
import { ChartBarMultiple } from "./ChartMultipleBar";
import CustomDropdown from "../reusable/CustomDropdown";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function DashboardHome() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [month,setMonth]=useState('January');

  const monthOptions = [
    { label: 'last 6 month', value: 'Last 6 month' },
    { label: 'last 3 month', value: 'Last 3 month' },
  ]
  
  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return predictionData;
    
    const searchLower = search.toLowerCase();
    return predictionData.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchLower)
      )
    );
  }, [search]);
  
  // Calculate pagination values
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page data - Calculate start and end indices
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    return filteredData.slice(startIndex, endIndex);
  };
  
  const currentPageData = getCurrentPageData();
  
  // Check if there are next/previous pages
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  // Reset to first page when search changes or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);
  
  const statCardsData: StatCardProps[] = [
    {
      title: "Overall Win Rate",
      value: "78%",
      period: "vs last month",
      icon: <WinRateIcon />,
    },
    {
      title: "Active Predictions",
      value: 48,
      period: "vs last month",
      icon: <StaticsIcon />,
    },
    {
      title: "Total Subscribers",
      value: "1,247",
      period: "vs last month",
      icon: <WalletIcon />,
    },
    {
      title: "Monthly Revenue",
      value: "$123,453",
      period: "vs last month",
      icon: <UsersIcon />,
    },
  ];
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  
  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-xl">
        <PageHeader
          title="Hi, Meyer"
          subtitle="This is your break down summaries so far"
          titleClass="text-2xl font-bold text-white"
          subtitleClass="text-[#687588] text-sm"
        />

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
              <p className="text-[#687588] text-sm font-medium">{card.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-4.5 flex gap-4.5   ">
        <div className='bg-[#0E121B] flex-3 rounded-xl'>
          <div className=" px-6 pt-6 flex justify-between items-center ">
          <h3 className=" text-white text-lg font-semibold">Overall Confidence vs Actual Outcome</h3>
          <CustomDropdown value={month} onChange={setMonth} options={monthOptions} className=" max-w-[160px] w-full" placeholder="last 6 month"  />

          </div>
          <ChartBarMultiple/>
        </div>
        <div className='bg-[#0E121B] flex-2  rounded-xl'>
           <div className=" px-6 pt-6 flex justify-between items-center ">
          <h3 className=" text-white text-lg font-semibold">Total Win rate</h3>
  

          </div>
           <ChartRadialStacked/> 
        </div>
      </div>

      {/* Table Section with Pagination */}
      <div className="bg-[#0E121B] mt-4.5 p-6 rounded-2xl">
        <div className="flex justify-between items-center">
          <h2 
           className="text-xl text-white font-bold">Recent Predictions</h2>
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            className="max-w-md" 
            placeholder="Search Picks"
          />
        </div>
        
        <div className="mt-6">
          <DynamicTable
            columns={PredictionColumn}
            data={currentPageData} // Pass only current page data
            // Do NOT pass pagination props to DynamicTable
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
          <div className=" ">
            <DynamicPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              // Items per page functionality
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[2, 5, 10, 15, 20, 25, 30, 50]}
              showItemsPerPage={true}
              show={totalItems > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}