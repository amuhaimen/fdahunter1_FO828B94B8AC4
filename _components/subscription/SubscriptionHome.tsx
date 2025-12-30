import React from 'react'
import PageHeader from '../reusable/PageHeader'
import SubscribersIcon from '../icons/subscription/SubscribersIcon';
import MonthlyRevIcon from '../icons/subscription/MonthlyRevIcon';
import RevPerUserIcon from '../icons/subscription/RevPerUserIcon';
import ChurnIcon from '../icons/subscription/ChurnIcon';

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function SubscriptionHome() {


  const statCardsData: StatCardProps[] = [
    {
      title: "Total Subscribers",
      value: "2,477",
      period: "vs last month",
      icon: <SubscribersIcon  />,
    },
    {
      title: "Monthly Revenue",
      value: '$63,046',
      period: "vs last month",
      icon: < MonthlyRevIcon />,
    },
    {
      title: "Avg. Revenue per User",
      value: "64",
      period: "vs last month",
      icon: <RevPerUserIcon />,
    },
    {
      title: "Churn Rate",
      value: "54%",
      period: "vs last month",
      icon: <ChurnIcon />,
    },
  ];

  return (
    <div>
        <div className=' bg-[#0E121B] p-6 rounded-lg'>
        <PageHeader title='Subscription Management' subtitle='Manage subscription plans and promo codes'/>
         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCardsData.map((card, index) => (
            <div
              className="p-3 relative border border-[#2B303B] rounded-xl overflow-hidden"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
                <h3 className="text-white text-base font-medium">{card.title}</h3>
              </div>
              <h2 className="text-white text-2xl font-medium my-3">{card.value}</h2>
              <p className="text-[#687588] text-sm font-medium">{card.period}</p>
            </div>
          ))}
        </div>

        </div>
    </div>
  )
}
