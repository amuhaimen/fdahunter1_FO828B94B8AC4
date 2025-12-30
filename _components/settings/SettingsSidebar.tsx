'use client'
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { usePathname } from "next/navigation";
// import AdminInfoIcon from '@/public/settings/icons/AdminInfoIcon';
// import NotificationIcon from '@/public/settings/icons/NotificationIcon';
// import Security from '@/public/settings/icons/Security';
// import IntegrationIcon from '@/public/settings/icons/IntegrationIcon';

interface SidebarItemType {
  name: string;
  href: string;
 
}

const sidebarItems: SidebarItemType[] = [
  {
    name: "General",
    href: "/dashboard/settings/general",
    // icon: AdminInfoIcon
  },
  {
    name: "Password",
    href: "/dashboard/settings/password",
 
  },
  {
    name: "Notifications",
    href: "/dashboard/settings/notification",
 
  } 
];

export default function SettingsSidebar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>("/dashboard/settings");

  useEffect(() => {
    const sortedItems = [...sidebarItems].sort((a, b) => b.href.length - a.href.length);
    
    const currentItem = sortedItems.find(item => {
      if (item.href === "/admin-dashboard/settings") {
        return pathname === "/admin-dashboard/settings";
      }
      return pathname.startsWith(item.href);
    });

    if (!currentItem && pathname.startsWith("/admin-dashboard/settings")) {
      setActiveItem("/admin-dashboard/settings");
    } else {
      setActiveItem(currentItem ? currentItem.href : "/admin-dashboard/settings");
    }
  }, [pathname]);

  const handleLinkClick = (href: string) => {
    setActiveItem(href);
  };

  const isActiveItem = (itemHref: string) => {
    return activeItem === itemHref;
  };

  return (
    <div className="bg-[#0E121B] py-6 px-4 rounded-[24px] xl:min-w-58 h-full min-h-[80vh]">
      <nav className="flex flex-row xl:flex-col gap-4 xl:gap-6 whitespace-nowrap overflow-x-auto scrollbar-hide">
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 py-2 px-3 rounded-xl transition-colors duration-200 ${
              isActiveItem(item.href)
                ? "bg-[#181B25] border border-[#323B49] text-white font-semibold text-sm"
                : "hover:bg-[#181B25] text-[#99A0AE]"
            }`}
            onClick={() => handleLinkClick(item.href)}
          >
         
            <h3 className="text-base font-medium">{item.name}</h3>
          </Link>
        ))}
      </nav>
    </div>
  );
}