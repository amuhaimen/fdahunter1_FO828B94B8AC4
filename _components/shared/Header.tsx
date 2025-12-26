import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import profileImg from '@/public/profilePic.png'
 
 
import Link from "next/link";
import NotificationIcon from "../icons/header/NotificationIcon";
import DropdowonIcon from "../icons/header/DropdownIcon";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
 

    const routeToTitle: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/dashboard/order-list": "Order List",
    "/dashboard/order-management": "Order Management",
    '/dashboard/test-management':"Test Status",
    "/dashboard/upload-results": "Upload Results",
    "/dashboard/payments": "Payments",
    "/dashboard/analytics": "Analytics",
    "/dashboard/settings": "Settings",
    "/dashboard/notification": "Notification",
  };
  
   // Dynamically change the title based on the base route
  const pageTitle: string = routeToTitle[pathname] || "Dashboard"; // Default to "Dashboard"

 
  const isNotificationActive = pathname === "/dashboard/notification" || 
                              pathname.startsWith("/dashboard/notification/");

  return (
    <>
      <header className="bg-[#181a25]  ">
        <div className="flex items-center justify-between py-5.5 px-6 border-b border-[#323B49]">
          {/* left content  */}
          <div className=" flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden cursor-pointer"
              onClick={onMenuClick}
            >
              <Menu />
            </button>
            <h2 className=" text-[#1D1F2C] text-2xl font-semibold cursor-pointer">
          {pageTitle}
            </h2>
          </div>
         {/* right content */}
          <div className=" flex items-center gap-4">
            {/* notification icon */}
            <Link 
              href='/dashboard/notification' 
              className={`border p-2 rounded-full cursor-pointer transition-all duration-200 ${
                isNotificationActive 
                  ? "border-primary bg-primary" 
                  : "border-[#E9E9EA]  "
              }`}
            >
              <NotificationIcon active={isNotificationActive} />
            </Link>

            <div className=" flex items-center gap-3">
              <Image src={profileImg} alt="profile img" className=" rounded-full" width={32} height={32} />
              <div>
                <h2 className="text-lg text-[#232323] font-medium">MedLab</h2>
                <p className=" text-xs text-[#6C6C6C] ">Lab Admin</p>
              </div>
              <button className=" cursor-pointer">
                <DropdowonIcon/>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}