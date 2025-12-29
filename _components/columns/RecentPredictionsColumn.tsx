import React from "react";
import { TrendingUp, TrendingDown, Minus, Edit, Trash2 } from "lucide-react";
import PenIcon from "../icons/predictions/PenIcon";
import TrashIcon from "../icons/predictions/TrashIcon";

// Define the column configuration
export const RecentPredictionColumn = [
  {
    label: "Sports Type",
    width: "15%",
    accessor: "sportsType",
    sortable: true,
    formatter: (value: string, row: any) => {
      return (
        <div className="flex items-center gap-2">
          {row?.image && (
            <div className="w-13 h-8 flex items-center justify-center bg-[#323B49] rounded-lg">
              {/* <img 
                src={row.image} 
                alt="sports img"
                className="w-5 h-5 object-contain"
                onError={(e) => {
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
    label: "Status",
    width: "15%",
    accessor: "status",
    sortable: true,
    formatter: (value: "cancel" | "win" | "lose") => {
      let statusConfig = {
        textColor: "",
        bgColor: "",
        displayText: ""
      };

      switch (value?.toLowerCase()) {
        case "win":
          statusConfig = {
            textColor: "text-white",
            bgColor: "bg-[#22C55E]",
            displayText: "Win"
          };
          break;
        case "lose":
          statusConfig = {
            textColor: "text-white",
            bgColor: "bg-[#EF4444]",
            displayText: "Lose"
          };
          break;
        case "cancel":
          statusConfig = {
            textColor: "text-[#374151]",
            bgColor: "bg-[#F9C80E]",
            displayText: "Cancel"
          };
          break;
        default:
          statusConfig = {
            textColor: "text-gray-400",
            bgColor: "bg-gray-800",
            displayText: value || "N/A"
          };
      }

      return (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg ${statusConfig.bgColor}`}>
            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
              {statusConfig.displayText}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    label: "Created",
    width: "15%",
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
          <span className={`text-sm text-white`}>
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
        <div className="text-sm text-white">
          {value}
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
      let colorClass = "text-white";
      
      if (value >= 80) {
        colorClass = "text-[#00F474]";
      } else if (value >= 60) {
        colorClass = "text-blue-400";
      } else if (value >= 40) {
        colorClass = "text-[#E6004C]";
      }
      
      return (
        <div className="flex items-center">
          <span className={`text-sm font-bold ${colorClass}`}>
            {value}%
          </span>
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
        <span className={`text-sm text-white`}>
          {value}
        </span>
      );
    },
  },
  {
    label: "Action",
    width: "9%",
    accessor: "action",
    sortable: false,
    formatter: (value: any, row: any) => {
      const handleEdit = () => {
        console.log("Edit clicked for row:", row.id);
        // You can call an edit function here
      };

      const handleDelete = () => {
        console.log("Delete clicked for row:", row.id);
        // You can call a delete function here
      };

      return (
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="p-1.5 bg-[#2F78EE] hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Edit"
          >
            <PenIcon/>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-[#E03137]  hover:bg-gray-800 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Delete"
          >
            <TrashIcon/>
          </button>
        </div>
      );
    },
  },
];