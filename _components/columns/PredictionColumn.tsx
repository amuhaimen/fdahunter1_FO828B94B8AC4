import Image from "next/image";
import React from "react";

// Define the column configuration
export const PredictionColumn = [
  {
    label: "Sports Type",
    width: "15%",
    accessor: "category",  // Changed from "sportsType" to "category"
    sortable: true,
    formatter: (value: string, row: any) => {
      return (
        <div className="flex items-center gap-2">
          {row?.image && (
            <div className="w-13 h-8 flex items-center justify-center bg-[#323B49] rounded-lg">
              <img 
                src={row.image} 
                alt="sports img"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  // Hide image container if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '';
                }}
              />
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
    accessor: "status",  // Added Status column
    sortable: true,
    formatter: (value: string) => {
     

      return (
        <div className="flex items-center">
         
            <span className={`text-sm font-medium  text-white text-base`}>
              {value}
            </span>
         
        </div>
      );
    },
  },
  {
    label: "Created",
    width: "12%",
    accessor: "createdAt",  // Changed from "createdDate" to "createdAt"
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
    width: "20%",
    accessor: "description",  // Changed from "teamName" to "description"
    sortable: true,
    formatter: (value: string) => {
      return (
        <div className="text-sm text-white    " title={value}>
          {value}
        </div>
      );
    },
  },
];