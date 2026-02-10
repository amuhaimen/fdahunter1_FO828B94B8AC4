import React from "react";

// Update interface to match API response
interface UserRowData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar: string | null;
  status: string;
  plan: string;
  amount: number;
  promoCode: string;
  isSubscriber: boolean;
}

// Define the column configuration for Users
export const UsersColumn = [
  {
    label: "User",
    width: "25%",
    accessor: "name" as keyof UserRowData,
    sortable: true,
    formatter: (value: string, row?: UserRowData) => {
      const avatar = row?.avatar;
      const name = value || "Unknown User";
      
      return (
        <div className="flex items-center gap-3">
          {avatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
              <img 
                src={avatar} 
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-avatar.svg";
                  target.className = "w-full h-full object-contain p-2";
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#323B49] flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">
              {name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    label: "Email",
    width: "20%",
    accessor: "email" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => {
      return (
        <span className="text-white text-sm">
          {value}
        </span>
      );
    },
  },
  {
    label: "Plan",
    width: "15%",
    accessor: "plan" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => {
      // Map API plan values to your design
      const planMapping: Record<string, string> = {
        'New Plan': 'Premium',
        'N/A': 'Free',
        'Enterprise': 'Enterprise',
        'Pro': 'Pro',
        'Basic': 'Basic'
      };
      
      const displayPlan = planMapping[value] || value;
      
      const planColors: Record<string, string> = {
        'Premium': 'text-[#00F474] bg-[#15673C]',
        'Pro': 'text-[#4F46E5] bg-[#1E1B4B]',
        'Basic': 'text-[#F59E0B] bg-[#78350F]',
        'Free': 'text-gray-400 bg-gray-800',
        'Enterprise': 'text-[#8B5CF6] bg-[#3B0764]',
        'New Plan': 'text-[#00F474] bg-[#15673C]', // Map New Plan to Premium
      };
      
      const colorClass = planColors[displayPlan] || 'text-[#0CAF60] bg-[#E7F7EF]';
      const [textColor, bgColor] = colorClass.split(' ');
      
      return (
        <div className="flex items-center">
          <div className={`px-3 py-1.5 rounded-lg ${bgColor}`}>
            <span className={`text-sm font-medium ${textColor}`}>
              {displayPlan}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    label: "Registered",
    width: "15%",
    accessor: "createdAt" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => {
      const date = new Date(value);
      const isValidDate = !isNaN(date.getTime());
      
      return (
        <span className="text-white text-sm">
          {isValidDate 
            ? date.toLocaleDateString('en-CA') // YYYY-MM-DD format
            : "Invalid date"}
        </span>
      );
    },
  },
  {
    label: "Status",
    width: "10%",
    accessor: "status" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => {
      // Map API status to your design status
      const statusMapping: Record<string, 'active' | 'trial' | 'expired'> = {
        'Active': 'active',
        'Expired': 'expired',
        'Trial': 'trial'
      };
      
      const mappedStatus = statusMapping[value] || 'expired';
      
      const statusConfig = {
        active: {
          text: "Active",
          textColor: "text-[#00F474]",
          bgColor: "bg-[#15673C]",
        },
        trial: {
          text: "Trial",
          textColor: "text-[#F9C80E]",
          bgColor: "bg-[#7D6407]",
        },
        expired: {
          text: "Expired",
          textColor: "text-[#E9E9EA]",
          bgColor: "bg-[#777980]",
        }
      };
      
      const config = statusConfig[mappedStatus];
      
      return (
        <div className={`px-3 py-1.5 inline rounded-lg ${config.bgColor}`}>
          <span className={`text-sm font-medium ${config.textColor}`}>
            {config.text}
          </span>
        </div>
      );
    },
  },
  {
    label: "Amount",
    width: "10%",
    accessor: "amount" as keyof UserRowData,
    sortable: true,
    formatter: (value: number) => {
      const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
      
      const isPositive = value > 0;
      const isZero = value === 0;
      
      return (
        <span className={`text-sm font-bold ${isPositive ? 'text-white' : isZero ? 'text-gray-400' : 'text-[#E6004C]'}`}>
          {formattedAmount}
        </span>
      );
    },
  },
  {
    label: "Promo Code",
    width: "15%",
    accessor: "promoCode" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => {
      const hasPromoCode = value && value !== "-";
      
      return (
        <span className={`text-sm ${hasPromoCode ? 'text-white' : 'text-gray-500'}`}>
          {hasPromoCode ? value : "No code"}
        </span>
      );
    },
  },
 
];

// Type for the column configuration
export interface ColumnConfig {
  label: string;
  width: string;
  accessor: keyof UserRowData;
  sortable: boolean;
  formatter: (value: any, row?: UserRowData) => React.ReactNode;
}