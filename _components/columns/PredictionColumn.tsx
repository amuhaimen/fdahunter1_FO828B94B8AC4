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
          <span className="text-[#4a4c56] text-sm font-medium">
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
      const categories: Record<string, string> = {
        NBA: "NBA Basketball",
        NFL: "NFL Football",
        MLB: "MLB Baseball",
        NHL: "NHL Hockey",
        PGA: "PGA Golf",
        UFC: "UFC MMA",
        "Soccer-Premier": "Premier League",
        "Soccer-LaLiga": "La Liga",
        Blackjack: "Blackjack",
        Roulette: "Roulette",
        Poker: "Poker",
        Slots: "Slots",
        "Tech-Stocks": "Technology Stocks",
        "Finance-Stocks": "Financial Stocks",
        "Energy-Stocks": "Energy Stocks",
      };
      
      return (
        <span className="text-[#4a4c56] text-sm font-medium">
          {categories[value as keyof typeof categories] || value}
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
          <span className={`text-sm ${isRecent ? 'text-[#3B82F6] font-medium' : 'text-[#909296]'}`}>
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
        <div className="flex flex-col space-y-1">
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
          <div className={`px-3 py-1.5 rounded-full ${bgColorClass}`}>
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
          <div className={`px-3 py-1.5 rounded-full ${bgColorClass}`}>
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
        
       
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full`}>
            {value}
          </span>
     
      );
    },
  },
];