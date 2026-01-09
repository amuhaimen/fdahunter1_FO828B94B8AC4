import DashboardHome from '@/_components/dashboardHome/DashboardHome'
import { AdminRoute, UserRoute } from '@/_components/PrivateRoute'
import React from 'react'

export default function page() {
  return (
    <div > 
  
  <AdminRoute>

    <DashboardHome/>
  </AdminRoute>

    
    </div>
  )
}
