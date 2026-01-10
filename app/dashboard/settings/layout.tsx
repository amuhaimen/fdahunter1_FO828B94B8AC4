"use client";

import { AdminRoute } from "@/_components/PrivateRoute";
import SettingsSidebar from "@/_components/settings/SettingsSidebar";

 

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AdminRoute>
     
      <div className="flex  flex-col xl:flex-row  gap-6 ">
        <div className="">
          <SettingsSidebar />
        </div>
        <div className=" flex-1">{children}</div>
      </div>
    </AdminRoute>
  );
}