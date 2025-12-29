import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// Define the column configuration
export const PredictionColumn = [
  {
    label: "Sports Type",
    width: "15%",
    accessor: "sportsType",
    sortable: true,
    formatter: (value: string,row:any) => {
     
      
      return (
        <div className="flex items-center gap-2">
          {row?.image && (
            <div className="w-13 h-8 flex items-center justify-center bg-[#323B49] rounded-lg">
              {/* <img 
                src={row.image} 
                alt="sports img"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-sports-icon.svg";
                }}
              /> */}
            </div>
          )}
          <span className="text-white text-sm font-medium">
            {value}
          </span>
        </div>
      );
    },
  },
  {
    label: "Sub Category",
    width: "15%",
    accessor: "subCategory",
    sortable: true,
    formatter: (value: string) => {
     
      
      return (
        <span className="text-white text-sm ">
      {value}
        </span>
      );
    },
  },
  {
    label: "Created",
    width: "12%",
    accessor: "createdDate",
    sortable: true,
    formatter: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const isRecent = date >= sevenDaysAgo;
      
      return (
        <div className="flex flex-col">
          <span className={`text-sm text-white `}>
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {isRecent && (
            <span className="text-xs text-green-600 font-medium">New</span>
          )}
        </div>
      );
    },
  },
  {
    label: "Team Name",
    width: "20%",
    accessor: "teamName",
    sortable: true,
    formatter: (value: string) => {
      
      return (
        <div className=" text-sm text-white">
          {value}
        </div>
      );
    },
  },
  {
    label: "Confidence",
    width: "12%",
    accessor: "confidence",
    sortable: true,
    formatter: (value: number) => {
      let colorClass = "text-gray-600";
      let bgColorClass = "bg-gray-100";
      
      if (value >= 80) {
        colorClass = "text-[#00F474]";
        bgColorClass = "bg-[#15673C]";
      } else if (value >= 60) {
        colorClass = "text-blue-700";
        bgColorClass = "bg-[#152667]";
      } else if (value >= 40) {
        colorClass = "text-[#E6004C]";
        bgColorClass = "bg-[#5C152D]";
      }
      
      return (
        <div className="flex items-center">
          <div className={`px-2.5 py-1   rounded-lg   ${bgColorClass}`}>
            <span className={`text-sm font-bold ${colorClass}`}>
              {value}%
            </span>
          </div>
        </div>
      );
    },
  },
  {
    label: "Win Rate",
    width: "12%",
    accessor: "winRate",
    sortable: true,
    formatter: (value: number) => {
      let colorClass = "text-gray-600";
      let bgColorClass = "bg-gray-100";
      
      if (value >= 80) {
        colorClass = "text-green-700";
        bgColorClass = "bg-green-50";
      } else if (value >= 60) {
        colorClass = "text-blue-700";
        bgColorClass = "bg-blue-50";
      } else if (value >= 40) {
        colorClass = "text-yellow-700";
        bgColorClass = "bg-yellow-50";
      }
      
      return (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-full  `}>
            <span className={`text-sm font-bold ${colorClass}`}>
              {value}%
            </span>
          </div>
        </div>
      );
    },
  },
  {
    label: "Signal",
    width: "14%",
    accessor: "signal",
    sortable: true,
    formatter: (value: string) => {
       
      return (
        
       
          <span className={`text-sm   text-white`}>
            {value}
          </span>
     
      );
    },
  },
];