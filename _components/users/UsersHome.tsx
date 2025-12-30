import React from 'react'
import DoubleUsersl from '../icons/users/DoubleUsersl';
import TikUsers from '../icons/users/TikUsers';
import PlusUsers from '../icons/users/PlusUsers';
import Token from '../icons/users/Token';
import PageHeader from '../reusable/PageHeader';


interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function UsersHome() {


 const statCardsData: StatCardProps[] = [
    {
      title: "Total Users",
      value: '2,847',
      period: "vs last month",
      icon: <DoubleUsersl />,
    },
    {
      title: "Active Users",
      value: '2,234',
      period: "vs last month",
      icon: <TikUsers />,
    },
    {
      title: "New Today",
      value: 18,
      period: "vs last month",
      icon: <PlusUsers />,
    },
    {
      title: "Promo code Users",
      value: "54%",
      period: "vs last month",
      icon: <Token />,
    },
  ];


  return (
    <div className="bg-[#0E121B] p-6 rounded-2xl"> 
            <PageHeader
          title="All Users"
          subtitle="Manage all your predictions across categories"
        />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCardsData.map((card, index) => (
            <div
              className="p-3 relative border border-[#2B303B] rounded-xl overflow-hidden"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
                <h3 className="text-white text-base font-medium">
                  {card.title}
                </h3>
              </div>
              <h2 className="text-white text-2xl font-medium my-3">
                {card.value}
              </h2>
              <p className="text-[#687588] text-sm font-medium">
                {card.period}
              </p>
            </div>
          ))}
        </div>
    </div>
  )
}
