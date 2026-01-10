import { AdminRoute } from '@/_components/PrivateRoute'
import SettingsHome from '@/_components/settings/SettingsHome'
import React from 'react'

export default function page() {
  return (
    <AdminRoute>
      <SettingsHome/>

    </AdminRoute>
  )
}
