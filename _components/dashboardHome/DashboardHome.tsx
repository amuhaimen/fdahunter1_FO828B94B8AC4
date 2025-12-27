'use client'
import React, { useState } from "react";
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


interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function DashboardHome() {

  const [search, setSearch]=useState('')
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
  return (
    <div>
    <div className=" bg-[#0E121B] p-6 rounded-xl">
      <PageHeader
        title="Hi, Meyer"
        subtitle="This is your break down summaries so far"
        titleClass=" text-2xl font-bold text-white"
        subtitleClass=" text-[#687588] text-sm"
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {statCardsData.map((card, index) => (
          <div
            className="p-3 relative border border-[#2B303B] rounded-xl overflow-hidden"
            key={index}
          >
            <div className=" flex items-center gap-2">
              <div className=" bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
              <h3 className=" text-white text-base font-medium">{card.title}</h3>
            </div>
            <h2 className=" text-white text-2xl font-medium my-3">{card.value}</h2>
            <p className=" text-[#687588] text-sm font-medium">{card.period}</p>
          </div>
        ))}
      </div>

    </div>

      {/*  */}
      <div className=" mt-4.5 flex gap-4.5 items-center">
      <div className='bg-[#0E121B] flex-3  '>
      <ChartRadialStacked/>

      </div>
      <div className='bg-[#0E121B] flex-2'>
      <ChartRadialStacked/>

      </div>

      </div>

      {/* tablee */}

      <div className=" bg-[#0E121B] mt-4.5 p-6 rounded-2xl">
        <div className=" flex justify-between items-center">
          <h2 className=" text-xl text-white  font-bold">Recent Predictions</h2>
          <SearchBar value={search} onChange={setSearch} className=" max-w-md  " placeholder="Search Picks"/>
        </div>
<div className=" mt-6">
         <DynamicTable
        columns={PredictionColumn}
        data={predictionData }
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

</div>

      </div>
    </div>
  );
}