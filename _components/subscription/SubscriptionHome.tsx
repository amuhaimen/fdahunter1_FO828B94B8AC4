"use client";
import React, { useState } from "react";
import PageHeader from "../reusable/PageHeader";
import SubscribersIcon from "../icons/subscription/SubscribersIcon";
import MonthlyRevIcon from "../icons/subscription/MonthlyRevIcon";
import RevPerUserIcon from "../icons/subscription/RevPerUserIcon";
import ChurnIcon from "../icons/subscription/ChurnIcon";
import PlusIcon from "../icons/predictions/PlusIcon";
import CustomModal from "../reusable/CustomModal";
import DocumentsIcon from "../icons/subscription/DocumentsIcon";
import TrashIcon from "../icons/predictions/TrashIcon";
import RedTrashIcon from "../icons/subscription/RedTrashIcon";
import TikMark from "../icons/subscription/TikMark";
import { Switch } from "@/components/ui/switch";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function SubscriptionHome() {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const statCardsData: StatCardProps[] = [
    {
      title: "Total Subscribers",
      value: "2,477",
      period: "vs last month",
      icon: <SubscribersIcon />,
    },
    {
      title: "Monthly Revenue",
      value: "$63,046",
      period: "vs last month",
      icon: <MonthlyRevIcon />,
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

  const cardsData = [
  {
    id: 1,
    title: "Welcome50",
    status: true,
    expires: "15/12/2024",
    usage: "500/1000",
  },
  {
    id: 2,
    title: "SAVE20",
    status: false,
    expires: "20/12/2024",
    usage: "250/500",
  },
  {
    id: 3,
    title: "BLACKFRIDAY",
    status: true,
    expires: "30/12/2024",
    usage: "750/1000",
  },
];

  return (
    <div>
      <div className=" bg-[#0E121B] p-6 rounded-lg">
        <PageHeader
          title="Subscription Management"
          subtitle="Manage subscription plans and promo codes"
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

      <div className=" bg-[#0E121B] p-6 rounded-lg mt-4.5">
        <div className=" flex items-center justify-between">
          <h3 className=" text-white text-2xl font-bold">Subscription Plans</h3>

          <button
            onClick={() => setPlanModalOpen(true)}
            className="bg-[#00F474] text-base text-[#1D1F2C] font-semibold p-2 rounded-lg
                                 cursor-pointer flex items-center gap-1 hover:bg-[#00F474]/90 transition active:scale-95"
          >
            <PlusIcon />
            Add new plan
          </button>
        </div>
        <div className=" p-4 border border-[#2B303B] mt-6 flex items-center justify-between rounded-t-lg">
          <h3 className=" text-white text-base font-semibold">VIP MEMBERS</h3>
          <div className=" flex items-center gap-2">
            <button className=" cursor-pointer">
              <DocumentsIcon />
            </button>
            <button className=" cursor-pointer">
              <RedTrashIcon />
            </button>
          </div>
        </div>
        <div className=" border-x border-b   border-[#2B303B]  pt-6 px-4 pb-4 rounded-b-lg flex items-center gap-6">
          <div className=" flex-3 text-white ">
            <h2 className=" text-white text-[32px] font-semibold">
              $99
              <span className=" text-sm text-[#A5A5AB] font-medium">
                /month
              </span>
            </h2>
            <p className=" text-sm text-[#A5A5AB] font-bold mt-2">
              For individuals new to budgeting and looking to take control of
              their finances with basic AI insights.
            </p>
          </div>
          <ul className=" flex-2  space-y-1 ">
            <li className=" flex items-center gap-2">
              <TikMark />
              <p className=" text-sm text-[#A5A5AB] font-medium">
                Al-based spending analysis
              </p>
            </li>
            <li className=" flex items-center gap-2">
              <TikMark />
              <p className=" text-sm text-[#A5A5AB] font-medium">
                Personalized savings suggestions
              </p>
            </li>
            <li className=" flex items-center gap-2">
              <TikMark />
              <p className=" text-sm text-[#A5A5AB] font-medium">
                Weekly expense reports
              </p>
            </li>
          </ul>
          <ul className=" flex-2  space-y-1 ">
            <li className=" flex items-center gap-2">
              <TikMark />
              <p className=" text-sm text-[#A5A5AB] font-medium">
                Basic budget setup and tracking
              </p>
            </li>
            <li className=" flex items-center gap-2">
              <TikMark />
              <p className=" text-sm text-[#A5A5AB] font-medium">
                Basic budget setup and tracking
              </p>
            </li>
            <li className=" flex items-center gap-2">
              <TikMark />
              <p className=" text-sm text-[#A5A5AB] font-medium">
                Basic budget setup and tracking
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className=" bg-[#0E121B] p-6 rounded-lg mt-4.5">
        <div className=" flex items-center justify-between">
          <h3 className=" text-white text-2xl font-bold">Promo Codes</h3>

          <button
            //  onClick={() => setIsModalOpen(true)}
            onClick={() => setCodeModalOpen(true)}
            className="bg-[#00F474] text-base text-[#1D1F2C] font-semibold p-2 rounded-lg
                                 cursor-pointer flex items-center gap-1 hover:bg-[#00F474]/90 transition active:scale-95"
          >
            <PlusIcon />
            Add promo code
          </button>
        </div>

        {/* promo code sections */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
    {cardsData.map((card) => (
      <div key={card.id} className="p-4 bg-[#21252d] rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl text-[#00F474] font-semibold" id={card.title}>
            {card.title}
          </h3>
          <div className="flex items-center gap-2">
            <button className="cursor-pointer">
              <DocumentsIcon />
            </button>
            <button className="cursor-pointer">
              <RedTrashIcon />
            </button>
          </div>
        </div>

        <ul className="mt-4 space-y-4">
          <li className="flex items-center justify-between">
            <p className="text-base text-[#D2D2D5] font-medium">status:</p>
            <Switch   className="cursor-pointer" />
          </li>
          <li className="flex items-center justify-between">
            <p className="text-base text-[#D2D2D5] font-medium">Expires:</p>
            <p className="text-base text-white font-medium">{card.expires}</p>
          </li>
          <li className="flex items-center justify-between">
            <p className="text-base text-[#D2D2D5] font-medium">Usage:</p>
            <p className="text-base text-white font-medium">{card.usage}</p>
          </li>
        </ul>
      </div>
    ))}
  </div>
      </div>

      <CustomModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
      >
        enter modal content here
      </CustomModal>
      <CustomModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
      >
        promo codes
      </CustomModal>
    </div>
  );
}
