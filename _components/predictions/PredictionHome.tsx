"use client";
import React, { useState, useMemo } from "react";
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

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function Prediction() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setSelectedCategories] = useState("");
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categoriesOption = [
    { value: "sports", label: "Sports" },
    { value: "stocks", label: "Stocks" },
    { value: "casino", label: "Casino" },
  ];

  const statCardsData: StatCardProps[] = [
    {
      title: "Total Records",
      value: 4641,
      period: "vs last month",
      icon: <TotalRecordsIcon />,
    },
    {
      title: "Active Predictions",
      value: 76,
      period: "vs last month",
      icon: <ActivePredictionIcon />,
    },
    {
      title: "Total Win",
      value: 64,
      period: "vs last month",
      icon: <TotalWin />,
    },
    {
      title: "Overall Win Rate",
      value: "54%",
      period: "vs last month",
      icon: <OverAllWinIcon />,
    },
  ];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return recentData;
    
    return recentData.filter(item => 
      item.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sportsType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-2xl">
        <PageHeader
          title="Predictions Management"
          subtitle="Manage all your predictions across categories"
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCardsData.map((card, index) => (
            <div
              className="p-3 relative border border-[#2B303B] rounded-xl overflow-hidden"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
                <h3 className="text-white text-base font-medium">
                  {card.title}
                </h3>
              </div>
              <h2 className="text-white text-2xl font-medium my-3">
                {card.value}
              </h2>
              <p className="text-[#687588] text-sm font-medium">
                {card.period}
              </p>
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
            options={categoriesOption}
            value={categories}
            onChange={setSelectedCategories}
            placeholder="Select status"
            className="flex-1 w-full"
          />
        </div>
        
        <div className="mt-6">
          <DynamicTable
            columns={RecentPredictionColumn}
            data={getCurrentPageData()} // Pass only current page data
            // Don't pass pagination props to DynamicTable since we're handling externally
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