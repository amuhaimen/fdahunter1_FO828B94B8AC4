import React from 'react'
import DashboardHome from '@/_components/dashboardHome/DashboardHome'
import { AdminRoute, UserRoute } from '@/_components/PrivateRoute'

export default function page() {
  return (
    <div >
      <AdminRoute>
        <DashboardHome />
      </AdminRoute>
    </div>
  )
}




