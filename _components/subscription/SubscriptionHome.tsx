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
import CustomDropdown from "../reusable/CustomDropdown";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function SubscriptionHome() {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [duration,setDuration]=useState('')


   const durationOption = [
    { value: "lifetime", label: "Lifetime" },
    { value: "1 month", label: "1 month" },
    { value: "6 months", label: "6 months" },
    { value: "1 year", label: "1 year" },
  ];


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
        title="Create New Subscription Plan"
        subTitle="Add a new subscription plan for your users."
      >
        <div className=" mt-6 mb-8 space-y-5">
         <div className=" flex items-center gap-5">
          <div>
            <label htmlFor="plan-name" className=" text-white text-sm font-medium">Plan Name</label>
            <input
              type="text"
              id="plan-name"
              className="w-full px-2 py-3   text-white rounded-lg  border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2"
              placeholder="Pro Plus"
            />
          </div>
          <div>
            <label htmlFor="plan-price" className=" text-white text-sm font-medium">Price ($)</label>
            <input
              type="text"
              id="plan-price"
              className="w-full px-2 py-3   text-white rounded-lg mt-1 border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium"
              placeholder="79"
            />
          </div>
         </div>

         <div>
             <label htmlFor="plan-price" className=" text-white text-sm font-medium">Duration</label>
             <div className=" mt-2">
             <CustomDropdown value={duration} onChange={setDuration} options={durationOption}/>

             </div>
         </div>

         <div>
          <label htmlFor="description"  className=" text-white text-sm font-medium"> Description</label>
          <textarea name="description" id="description" className="w-full  p-2  text-white rounded-lg   border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 h-[112px]" placeholder=" A comprehensive plan for growing businesses..."></textarea>
         </div>
         <div>
          <label htmlFor="features"  className=" text-white text-sm font-medium"> Features (one per line)</label>
          <textarea name="features" id="features" className="w-full  p-2  text-white rounded-lg   border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 h-[112px]" placeholder="Unlimited searches"></textarea>
         </div>

        </div>

        <div className=" flex items-center justify-end gap-4 mb-6">
          <button className=" text-base text-[#99A0AE] font-semibold px-5 py-3 bg-[#181B25] rounded-lg cursor-pointer">Cancel</button>
          <button className=" text-base text-[#1D1F2C] font-semibold px-5 py-3 bg-[#00f474] rounded-lg cursor-pointer">Create Plan</button>
        </div>
      </CustomModal>    
      <CustomModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        title="Create Promo Code"
        subTitle="Create a new promotional code for subscribers"
      >
        promo codes
      </CustomModal>
    </div>
  );
}
