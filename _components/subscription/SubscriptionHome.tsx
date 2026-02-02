"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../reusable/PageHeader";
import SubscribersIcon from "../icons/subscription/SubscribersIcon";
import MonthlyRevIcon from "../icons/subscription/MonthlyRevIcon";
import RevPerUserIcon from "../icons/subscription/RevPerUserIcon";
import ChurnIcon from "../icons/subscription/ChurnIcon";
import PlusIcon from "../icons/predictions/PlusIcon";
import CustomModal from "../reusable/CustomModal";
import DocumentsIcon from "../icons/subscription/DocumentsIcon";
import RedTrashIcon from "../icons/subscription/RedTrashIcon";
import TikMark from "../icons/subscription/TikMark";
import { Switch } from "@/components/ui/switch";
import CustomDropdown from "../reusable/CustomDropdown";
import { dashboardApi } from "@/services/dashboardApi";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
}

export default function SubscriptionHome() {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [planName, setPlanName] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [planAmount, setPlanAmount] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  
  // Use demo data only
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 1,
      name: "VIP MEMBERS",
      subtitle: "Premium Access",
      price: 99,
      duration: "month",
      description: "For individuals new to budgeting and looking to take control of their finances with basic AI insights.",
      features: [
        "AI-based spending analysis",
        "Personalized savings suggestions",
        "Weekly expense reports",
        "Basic budget setup and tracking",
        "Basic budget setup and tracking",
        "Basic budget setup and tracking"
      ]
    },
    {
      id: 2,
      name: "PRO PLAN",
      subtitle: "Advanced Features",
      price: 199,
      duration: "month",
      description: "Advanced features for professional users with comprehensive financial tools.",
      features: [
        "Advanced AI analysis",
        "Priority customer support",
        "Monthly financial reports",
        "Investment tracking",
        "Tax optimization tools",
        "Custom budget categories"
      ]
    },
    {
      id: 3,
      name: "ENTERPRISE",
      subtitle: "Business Solution",
      price: 499,
      duration: "month",
      description: "Complete financial solution for businesses with team management features.",
      features: [
        "Multi-user access",
        "Custom API integration",
        "Dedicated account manager",
        "Advanced reporting tools",
        "White-label solutions",
        "Custom training sessions"
      ]
    },
    {
      id: 4,
      name: "BASIC",
      subtitle: "Starter Plan",
      price: 49,
      duration: "month",
      description: "Essential features for individuals starting their financial journey.",
      features: [
        "Basic spending analysis",
        "Monthly expense reports",
        "Simple budget tracking",
        "Email support",
        "Mobile app access",
        "Financial tips"
      ]
    }
  ];

  const durationOptions = [
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "180", label: "180 days" },
    { value: "365", label: "1 year" },
    { value: "lifetime", label: "Lifetime" },
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

  const handleCreatePlan = async () => {
    // Validation
    if (!planName.trim()) {
      toast.error("Plan name is required");
      return;
    }
    if (!planTitle.trim()) {
      toast.error("Plan title is required");
      return;
    }
    if (!planAmount.trim() || isNaN(Number(planAmount)) || Number(planAmount) <= 0) {
      toast.error("Valid amount is required");
      return;
    }
    if (!duration) {
      toast.error("Duration is required");
      return;
    }
    if (!planDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    setLoading(true);
    
    try {
      const requestData = {
        name: planName.trim(),
        title: planTitle.trim(),
        description: planDescription.trim(),
        amount: Number(planAmount),
        duration: duration === "lifetime" ? "0" : duration,
      };

      // Call the API to create subscription
      const response = await dashboardApi.createSubscriptionPackage(requestData);

      if (response.success) {
        toast.success("Subscription plan created successfully!");
        
        // Reset form
        setPlanName("");
        setPlanTitle("");
        setPlanAmount("");
        setPlanDescription("");
        setDuration("");
        
        // Close modal
        setPlanModalOpen(false);
      } else {
        toast.error(response.message || "Failed to create subscription plan");
      }
    } catch (error: any) {
      console.error("Error creating subscription plan:", error);
      toast.error(error.message || "Failed to create subscription plan");
    } finally {
      setLoading(false);
    }
  };

  // Function to render subscription cards
  const renderSubscriptionCards = () => {
    const isSinglePlan = subscriptionPlans.length === 1;

    if (isSinglePlan) {
      const plan = subscriptionPlans[0];
      
      return (
        <div>
          <div className="p-4 border border-[#2B303B] mt-6 flex items-center justify-between rounded-t-lg">
            <div>
              <h3 className="text-white text-base font-semibold">{plan.name}</h3>
              <p className="text-[#A5A5AB] text-sm font-medium mt-1">{plan.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="cursor-pointer hover:bg-white/10 p-1 rounded">
                <DocumentsIcon />
              </button>
              <button className="cursor-pointer hover:bg-white/10 p-1 rounded">
                <RedTrashIcon />
              </button>
            </div>
          </div>
          <div className="border-x border-b border-[#2B303B] pt-6 px-4 pb-4 rounded-b-lg flex items-center gap-6">
            <div className="flex-3 text-white">
              <h2 className="text-white text-[32px] font-semibold">
                ${plan.price}
                <span className="text-sm text-[#A5A5AB] font-medium">
                  /{plan.duration}
                </span>
              </h2>
              <p className="text-sm text-[#A5A5AB] font-bold mt-2">
                {plan.description}
              </p>
            </div>
            <ul className="flex-2 space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <TikMark />
                  </div>
                  <p className="text-sm text-[#A5A5AB] font-medium">
                    {feature}
                  </p>
                </li>
              ))}
            </ul>
            <ul className="flex-2 space-y-1">
              {plan.features.slice(3, 6).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <TikMark />
                  </div>
                  <p className="text-sm text-[#A5A5AB] font-medium">
                    {feature}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    // Multiple cards layout - 3 per row
    const getGridColumns = () => {
      if (subscriptionPlans.length === 2) return "grid-cols-1 md:grid-cols-2";
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    };

    return (
      <div className={`grid ${getGridColumns()} gap-6 mt-6`}>
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id}
            className="border border-[#2B303B] rounded-lg overflow-hidden hover:border-[#00F474]/30 transition-colors duration-200"
          >
            {/* Card Header with Title and Subtitle */}
            <div className="p-4 bg-[#181B25] border-b border-[#2B303B]">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white text-base font-semibold">{plan.name}</h3>
                  <p className="text-[#A5A5AB] text-xs font-medium mt-1">{plan.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer hover:bg-white/10 p-1 rounded">
                    <DocumentsIcon />
                  </button>
                  <button className="cursor-pointer hover:bg-white/10 p-1 rounded">
                    <RedTrashIcon />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-4 bg-[#0E121B]">
              {/* Price */}
              <div className="mb-4">
                <h2 className="text-white text-2xl md:text-[28px] font-semibold">
                  ${plan.price}
                  <span className="text-sm text-[#A5A5AB] font-medium ml-1">
                    /{plan.duration}
                  </span>
                </h2>
                <p className="text-sm text-[#A5A5AB] font-medium mt-2 line-clamp-2">
                  {plan.description}
                </p>
              </div>
              
              {/* Features - Single column for card layout */}
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-1 flex-shrink-0">
                      <TikMark />
                    </div>
                    <p className="text-sm text-[#A5A5AB] font-medium flex-1">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <button className="w-full mt-6 py-2.5 bg-[#00F474] text-[#1D1F2C] font-semibold rounded-lg hover:bg-[#00F474]/90 transition-colors active:scale-[0.98]">
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-lg">
        <PageHeader
          title="Subscription Management"
          subtitle="Manage subscription plans and promo codes"
        />
        {/* stats */}
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

      <div className="bg-[#0E121B] p-6 rounded-lg mt-4.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-2xl font-bold">Subscription Plans</h3>
            <p className="text-[#A5A5AB] text-sm font-medium mt-1">Manage and customize your subscription packages</p>
          </div>

          <button
            onClick={() => setPlanModalOpen(true)}
            className="bg-[#00F474] text-base text-[#1D1F2C] font-semibold p-2 rounded-lg
                                 cursor-pointer flex items-center gap-1 hover:bg-[#00F474]/90 transition active:scale-95"
          >
            <PlusIcon />
            Add new plan
          </button>
        </div>
        
        {/* Subscription Cards - Using demo data */}
        {renderSubscriptionCards()}
      </div>

      <div className="bg-[#0E121B] p-6 rounded-lg mt-4.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-2xl font-bold">Promo Codes</h3>
            <p className="text-[#A5A5AB] text-sm font-medium mt-1">Create and manage promotional discount codes</p>
          </div>

          <button
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
                <div>
                  <h3 className="text-2xl text-[#00F474] font-semibold">{card.title}</h3>
                  <p className="text-[#A5A5AB] text-xs font-medium mt-1">Discount Code</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer hover:bg-white/10 p-1 rounded">
                    <DocumentsIcon />
                  </button>
                  <button className="cursor-pointer hover:bg-white/10 p-1 rounded">
                    <RedTrashIcon />
                  </button>
                </div>
              </div>

              <ul className="mt-4 space-y-4">
                <li className="flex items-center justify-between">
                  <p className="text-base text-[#D2D2D5] font-medium">Status:</p>
                  <Switch className="cursor-pointer" />
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

      {/* Create Plan Modal */}
      <CustomModal
        isOpen={planModalOpen}
        onClose={() => {
          setPlanModalOpen(false);
          // Reset form
          setPlanName("");
          setPlanTitle("");
          setPlanAmount("");
          setPlanDescription("");
          setDuration("");
        }}
        title="Create New Subscription Plan"
        subTitle="Add a new subscription plan for your users."
      >
        <div className="mt-6 mb-8 space-y-5">
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <label htmlFor="plan-name" className="text-white text-sm font-medium">Plan Name*</label>
              <input
                type="text"
                id="plan-name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="VIP Membership"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="plan-title" className="text-white text-sm font-medium">Plan Title*</label>
              <input
                type="text"
                id="plan-title"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="Premium Access"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex-1">
              <label htmlFor="plan-amount" className="text-white text-sm font-medium">Amount ($)*</label>
              <input
                type="number"
                id="plan-amount"
                value={planAmount}
                onChange={(e) => setPlanAmount(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="99"
                min="1"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="plan-duration" className="text-white text-sm font-medium">Duration*</label>
              <div className="mt-2">
                <CustomDropdown 
                  value={duration} 
                  onChange={setDuration} 
                  options={durationOptions}
                  className="w-full"
                  placeholder="Select duration"
                  // disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="text-white text-sm font-medium">Description* (Features separated by comma)</label>
            <textarea 
              name="description" 
              id="description"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="w-full p-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 h-[112px] bg-[#0E121B] resize-none focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50" 
              placeholder="AI-based spending analysis, Personalized savings suggestions, Weekly expense reports, Basic budget setup and tracking"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mb-6">
          <button 
            className="text-base text-[#99A0AE] font-semibold px-5 py-3 bg-[#181B25] rounded-lg cursor-pointer hover:bg-[#181B25]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPlanModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="text-base text-[#1D1F2C] font-semibold px-5 py-3 bg-[#00f474] rounded-lg cursor-pointer hover:bg-[#00F474]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleCreatePlan}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              "Create Plan"
            )}
          </button>
        </div>
      </CustomModal>    
      
      <CustomModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        title="Create Promo Code"
        subTitle="Create a new promotional code for subscribers"
      >
        <div className="mt-6 mb-8 space-y-5">
          <div>
            <label htmlFor="code-name" className="text-white text-sm font-medium">Promo Code</label>
            <input
              type="text"
              id="code-name"
              className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
              placeholder="SUMMER2024"
            />
          </div>
          
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <label htmlFor="discount" className="text-white text-sm font-medium">Discount (%)</label>
              <input
                type="number"
                id="discount"
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="20"
                min="1"
                max="100"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="max-usage" className="text-white text-sm font-medium">Max Usage</label>
              <input
                type="number"
                id="max-usage"
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="1000"
                min="1"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="expiry-date" className="text-white text-sm font-medium">Expiry Date</label>
            <input
              type="date"
              id="expiry-date"
              className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mb-6">
          <button 
            className="text-base text-[#99A0AE] font-semibold px-5 py-3 bg-[#181B25] rounded-lg cursor-pointer hover:bg-[#181B25]/90 transition-colors"
            onClick={() => setCodeModalOpen(false)}
          >
            Cancel
          </button>
          <button className="text-base text-[#1D1F2C] font-semibold px-5 py-3 bg-[#00f474] rounded-lg cursor-pointer hover:bg-[#00F474]/90 transition-colors">
            Create Promo Code
          </button>
        </div>
      </CustomModal>
    </div>
  );
}