 'use client'
 import React, { useState } from 'react'
import PageHeader from '../reusable/PageHeader'
import TotalRecordsIcon from '../icons/predictions/TotalRecordsIcon';
import ActivePredictionIcon from '../icons/predictions/ActivePredictionIcon';
import TotalWin from '../icons/predictions/TotalWin';
import OverAllWinIcon from '../icons/predictions/OverAllWinIcon';
import PlusIcon from '../icons/predictions/PlusIcon';
import { Search } from 'lucide-react';
import { SearchBar } from '../reusable/SearchBar';
import CustomDropdown from '../reusable/CustomDropdown';


interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}
 
 export default function Prediction() {

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setSelectedCategories] = useState('');

    const categoriesOption = [
    { value: 'sports', label: 'Sports' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'casino', label: 'Casino' },
  ];

 const statCardsData: StatCardProps[] = [
    {
      title: "Total Records",
      value: 4641,
      period: "vs last month",
      icon: <TotalRecordsIcon  />,
    },
    {
      title: "Active Predictions",
      value: 76,
      period: "vs last month",
      icon: <ActivePredictionIcon />,
    },
    {
      title: "Total Win",
      value: 64,
      period: "vs last month",
      icon: <TotalWin />,
    },
    {
      title: "Overall Win Rate",
      value: "54%",
      period: "vs last month",
      icon: <OverAllWinIcon />,
    },
  ];



  
   return (
     <div>
        <div className=' bg-[#0E121B] p-6 rounded-2xl '>
        <PageHeader title='Predictions Management' subtitle='Manage all your predictions across categories'/>
        

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCardsData.map((card, index) => (
            <div
              className="p-3 relative border border-[#2B303B] rounded-xl overflow-hidden"
              key={index}
            >
              <div className=" flex items-center gap-2">
                <div className=" bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
                <h3 className=" text-white text-base font-medium">{card.title}</h3>
              </div>
              <h2 className=" text-white text-2xl font-medium my-3">{card.value}</h2>
              <p className=" text-[#687588] text-sm font-medium">{card.period}</p>
            </div>
          ))}
        </div>
        </div>
        <div className=' bg-[#0E121B] p-6 rounded-2xl mt-4'>
               <div className=' flex justify-between items-center'>
                <h2 className=' text-white text-xl font-bold'>Recent Predictions</h2>
                <button className='  bg-[#00F474]  text-base text-[#1D1F2C] font-semibold p-2 rounded-lg
                 cursor-pointer flex items-center gap-1 hover:bg-[#00F474]/90 transition active:scale-95'>
                  <PlusIcon/>
                   Add new prediction</button>
               </div>
   <div className=' mt-5 flex flex-col lg:flex-row items-center w-full gap-3.5'>
    <SearchBar placeholder='Search Picks' value={searchTerm} onChange={setSearchTerm } className='  flex-1'/>
    <CustomDropdown options={categoriesOption} value={categories} onChange={setSelectedCategories} placeholder='Select categories' className='  flex-1  w-full' />
    <CustomDropdown options={categoriesOption} value={categories} onChange={setSelectedCategories} placeholder='Select status' className='  flex-1 w-full' />
   </div>
        </div>
     </div>
   )
 }
 
