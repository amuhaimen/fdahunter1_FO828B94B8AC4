import React from 'react'

export default function Password() {
  return (
    <div className=' bg-[#0E121B] p-6 rounded-[24px]'>
        <h2 className=' text-2xl text-white font-semibold'>Change Password</h2>

        <div className=' my-8 space-y-6'>
            <div>
                <label htmlFor="old-password" className=' text-white text-base font-semibold'>Old Password <span className='text-[#E03137]'>*</span></label>
                <input type="text" id='old-password' className=' py-4.5 px-5 border border-[#2B303B] rounded-[10px] w-full mt-2 ' />
            </div>
            <div>
                <label htmlFor="new-password" className=' text-white text-base font-semibold'>New Password <span className='text-[#E03137]'>*</span></label>
                <input type="text" id='new-password' className=' py-4.5 px-5 border border-[#2B303B] rounded-[10px] w-full mt-2 ' />
            </div>
            <div>
                <label htmlFor="confirm-password" className=' text-white text-base font-semibold'>Confirm Password <span className='text-[#E03137]'>*</span></label>
                <input type="text" id='confirm-password' className=' py-4.5 px-5 border border-[#2B303B] rounded-[10px] w-full mt-2 ' />
            </div>

        </div>

        <div className=' flex justify-end gap-2'>
            <button className=' text-base text-[#183F6D] font-semibold bg-[#00F474] py-3.5 px-4 rounded-lg cursor-pointer hover:bg-[#00F474]/90 transition-all duration-100 ease-in-out'>Update Password</button>
            <button className=' text-base text-[#65686C] border border-[#323B49] font-semibold   py-3.5 px-4 rounded-lg cursor-pointer  '> Cancel</button>
        </div>
    </div>
  )
}
