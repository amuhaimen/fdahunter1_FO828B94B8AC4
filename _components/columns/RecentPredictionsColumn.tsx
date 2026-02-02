import React from "react";
import PenIcon from "../icons/predictions/PenIcon";
import TrashIcon from "../icons/predictions/TrashIcon";

// Define the column configuration
export const RecentPredictionColumn = (handleEditClick: (prediction: any) => void) => [
  {
    label: "Sports Type",
    width: "15%",
    accessor: "category",
    sortable: true,
    formatter: (value: string, row: any) => {
      const hasImage = row?.image && row.image.trim() !== "";
      
      return (
        <div className="flex items-center gap-2">
          <div className="w-13 h-8 flex items-center justify-center bg-[#323B49] rounded-lg overflow-hidden">
            {hasImage ? (
              <img 
                src={row.image} 
                alt="sports img"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image container if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Show fallback div
                  const container = target.parentElement;
                  if (container) {
                    container.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-[#323B49] rounded-lg border border-[#4B5563]">
                      
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#323B49] rounded-lg border border-[#4B5563]">
                {/* <span className="text-gray-400 text-xs">No Image</span> */}
              </div>
            )}
          </div>
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
    width: "12%",
    accessor: "createdAt",
    sortable: true,
    formatter: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const isRecent = date >= sevenDaysAgo;
      
      return (
        <div className="flex flex-col">
          <span className="text-sm text-white">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      );
    },
  },
  {
    label: "Notes",
    width: "23%",
    accessor: "description",
    sortable: true,
    formatter: (value: string) => {
      return (
        <div className="text-sm text-white" title={value}>
          {value}
        </div>
      );
    },
  },
  {
    label: "Action",
    width: "5%",
    accessor: "action",
    sortable: false,
    formatter: (value: any, row: any) => {
      const handleEdit = () => {
        handleEditClick(row);
      };

      const handleDelete = () => {
        console.log("Delete clicked for row:", row.id);
        // You can call a delete function here
      };

      return (
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="p-1.5 bg-[#2F78EE] hover:bg-blue-600 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Edit"
          >
            <PenIcon/>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-[#E03137] hover:bg-red-600 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Delete"
          >
            <TrashIcon/>
          </button>
        </div>
      );
    },
  },
];