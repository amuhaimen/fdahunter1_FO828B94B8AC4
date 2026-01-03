"use client";
import React, { useState } from "react";
import DoubleUsersl from "../icons/users/DoubleUsersl";
import TikUsers from "../icons/users/TikUsers";
import PlusUsers from "../icons/users/PlusUsers";
import Token from "../icons/users/Token";
import PageHeader from "../reusable/PageHeader";
import { SearchBar } from "../reusable/SearchBar";
import CustomDropdown from "../reusable/CustomDropdown";
import DynamicTable from "../reusable/DynamicTable";
import { UsersColumn } from "../columns/UsersColumn";
import usersData from "../data/usersData.json";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function UsersHome() {
  const [categories, setSelectedCategories] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const categoriesOption = [
    { value: "sports", label: "Sports" },
    { value: "stocks", label: "Stocks" },
    { value: "casino", label: "Casino" },
  ];

  const statCardsData: StatCardProps[] = [
    {
      title: "Total Users",
      value: "2,847",
      period: "vs last month",
      icon: <DoubleUsersl />,
    },
    {
      title: "Active Users",
      value: "2,234",
      period: "vs last month",
      icon: <TikUsers />,
    },
    {
      title: "New Today",
      value: 18,
      period: "vs last month",
      icon: <PlusUsers />,
    },
    {
      title: "Promo code Users",
      value: "54%",
      period: "vs last month",
      icon: <Token />,
    },
  ];

  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-2xl">
        <PageHeader
          title="All Users"
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

      <div className="bg-[#0E121B] p-6 rounded-2xl mt-4.5">
        <h3 className=" text-white text-xl font-bold">Users</h3>

        <div className="mt-5 flex flex-col lg:flex-row items-center w-full gap-3.5">
          <SearchBar
            placeholder="Search Picks"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              // setCurrentPage(1);
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
            columns={UsersColumn}
            data={usersData}
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

          {/* <div className=" ">
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
                  </div> */}
        </div>
      </div>
    </div>
  );
}
