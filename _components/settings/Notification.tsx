import { Switch } from '@/components/ui/switch'
import React from 'react'

export default function Notification() {
  return (
    <div className=' bg-[#0E121B] p-6 rounded-[24px]'>
        <div>
            <h3 className=' text-white text-lg font-semibold'>Push Notifications</h3>
            <p className=' mt-1 text-sm font-medium text-[#777980]'>Get alerts for newly posted wages, confirmations when payments go through successfully, and notifications whenever any fresh update is available.</p>
        </div>
        <div className=' mt-8 space-y-6'>
            <div className=' flex items-center justify-between'>
                <div >
               <h3 className=' text-white text-lg font-semibold'>Subscription Confirmation</h3>
            <p className=' mt-1 text-sm font-medium text-[#777980]'>Receive confirmation notification after placing the Subscription.</p>

                </div>
                <Switch className=' cursor-pointer'/>
            </div>
            <div className=' flex items-center justify-between'>
                <div >
               <h3 className=' text-white text-lg font-semibold'>Reminders and Events</h3>
            <p className=' mt-1 text-sm font-medium text-[#777980]'>Receive push notification whenever the platform requires your attentions</p>

                </div>
                <Switch className=' cursor-pointer'/>
            </div>
            <div className=' flex items-center justify-between'>
                <div >
               <h3 className=' text-white text-lg font-semibold'>Promotions and Offers</h3>
            <p className=' mt-1 text-sm font-medium text-[#777980]'>Receive push notification whenever the platform requires your attentions</p>

                </div>
                <Switch className=' cursor-pointer'/>
            </div>
            <div className=' flex items-center justify-between'>
                <div >
               <h3 className=' text-white text-lg font-semibold'>Email Notifications</h3>
            <p className=' mt-1 text-sm font-medium text-[#777980]'>Receive push notification via E-mail</p>

                </div>
                <Switch className=' cursor-pointer'/>
            </div>

        </div>
    </div>
  )
}
