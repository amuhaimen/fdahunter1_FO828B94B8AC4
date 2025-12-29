"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import CrossIcon from "../icons/predictions/CrossIcon";
import CustomDropdown from "../reusable/CustomDropdown";

interface TestData {
  testName: string;
  duration: string;
  price: string;
  status: "Active" | "Inactive";
}

interface AddTestSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (data: TestData) => void;
}

const AddPredictionSidebar: React.FC<AddTestSidebarProps> = ({
  isOpen = false,
  onClose,
  onSave,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
    const [categories, setSelectedCategories] = useState("");


    const categoriesOption = [
    { value: "sports", label: "Sports" },
    { value: "stocks", label: "Stocks" },
    { value: "casino", label: "Casino" },
  ];
 
  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else if (!isOpen && isVisible) {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
      // Reset form when closing
     
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

 

  const handleSave = () => {
     
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-3 top-5 bottom-5 h-[calc(100%-2.5rem)] w-full max-w-[80%] md:max-w-[30%] bg-[#0E121B] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-lg overflow-hidden flex flex-col ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-6   bg-[#181B25]">
          <h2 className="text-lg text-white font-sans font-medium">
            Add New Prediction
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-black rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <CrossIcon />
          </button>
        </div>

        {/* Content area - This will grow to fill space */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          <div className=" space-y-5">
            <div>
            <label htmlFor="" className=" text-white text-sm font-medium ">
              Category <span className=" text-[#E93544]">*</span>
            </label>
            <CustomDropdown
              options={categoriesOption}
              value={categories}
              onChange={setSelectedCategories}
              placeholder="Select categories"
              className="  flex-1  w-full mt-2  "
            />

            </div>

            <div>
                <label htmlFor="note" className=" text-white text-sm font-medium ">Notes <span className=" text-[#E93544]">*</span></label>
                <textarea name="" id="" className=" w-full mt-2 border border-[#2B303B] h-26.5 focus:ring-1 focus:border-[#00f474] focus:outline-none rounded-lg  p-2 placeholder:text-sm placeholder:text-[#717784]  " placeholder="Provide a detailed analysis and summary for this prediction..."></textarea>
            </div>
          </div>
          <div className=" flex flex-col lg:flex-row items-center gap-4">
            <button onClick={handleCancel} className=" py-3 bg-[#181B25] hover:bg-[#181B25]/90 active:scale-95 rounded-lg text-base text-[#99A0AE] font-semibold w-full cursor-pointer">Cancel</button>
            <button className=" py-3 bg-[#00F474] rounded-lg text-base text-[#1D1F2C] hover:bg-[#00F474]/90 font-semibold w-full cursor-pointer active:scale-95  transition-all ease-in duration-100" >Create Prediction</button>
          
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPredictionSidebar;