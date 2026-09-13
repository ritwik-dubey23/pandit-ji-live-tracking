import React from 'react'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa6"
import { useNavigate } from 'react-router-dom'
import { FaPen } from "react-icons/fa";
import OwnerItemCard from './OwnerItemCard'

function OwnerDashboard() {

  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()

  console.log("MY SHOP DATA:", myShopData)

  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      {!myShopData && (
        <div className='flex justify-center items-center p-4 sm:p-6 mt-16'>

          <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>

            <div className='flex flex-col items-center text-center'>

              <FaUtensils
                size={20}
                className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4'
              />

              <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                Add Your Restaurant
              </h1>

              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                🍽️ Partner with us and grow your food business.
                🚀 Reach more customers, manage orders easily, and boost your sales every day.
              </p>

              <button
                className='font-medium shadow-md bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-200'
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started

                <span className="text-[11px] leading-none opacity-80 ml-1">
                  with us
                </span>

              </button>

            </div>

          </div>

        </div>
      )}

      {myShopData && (

        <div className="pt-24 px-4 sm:px-6">

          {/* Welcome */}

          <div className="w-full flex justify-center">

            <h1 className="flex items-center gap-3 text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">

              <FaUtensils className="text-[#ff4d2d] w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shrink-0" />

              <span>

                <span className="text-[#ff4d2d]">
                  Welcome to{" "}
                </span>

                <span className="text-gray-800">
                  {myShopData.name}
                </span>

              </span>

            </h1>

          </div>


          {/* Shop Image Card */}

          <div className="w-full flex justify-center mt-8">

            <div className="relative w-full max-w-3xl bg-white shadow-lg rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">

              {/* // Edit ICON */}

              <div
                className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-3 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-md z-10"
                onClick={() => navigate("/create-edit-shop")}
              >

                <FaPen className="w-4 h-4" />

              </div>


              <div className="w-full flex justify-center items-center bg-gray-50">

                <img
                  src={myShopData.image}
                  alt={myShopData.name}
              className="w-full h-auto max-h-[280px] sm:max-h-[350px] md:max-h-[420px] object-contain block rounded-3xl"
              />

              </div>


              <div className="p-4 sm:p-6">

                <h1 className='text-xl sm:text-3xl font-bold text-gray-800 mb-2'>
                  {myShopData.name}
                </h1>

                <p className='text-gray-500'>
                  {myShopData.city}, {myShopData.state}
                </p>

                <p className='text-gray-500 mb-4'>
                  {myShopData.address}
                </p>

              </div>

            </div>

          </div>


          {/* Add Food Items */}
{(!myShopData.items || myShopData.items.length === 0) && (

            <div className='flex justify-center items-center p-4 sm:p-6 mt-16'>

              <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>

                <div className='flex flex-col items-center text-center'>

                  <FaUtensils
                    size={20}
                    className='text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4'
                  />

                  <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>
                    Add Your Food Items
                  </h1>

                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    🍽️ Add your delicious food items and showcase them to more customers.
                    🚀 Manage your menu easily and grow your food business every day.
                  </p>

                  <button
                    className='font-medium shadow-md bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full hover:bg-orange-600 transition-colors duration-200'
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food Items

                    <span className="text-[11px] leading-none opacity-80 ml-1">
                      with us
                    </span>

                  </button>

                </div>

              </div>

            </div>

          )}



{/* 
// FOOD ITEM CaRD */} 

{myShopData?.items?.length > 0 && (
  <div className='w-full flex justify-center mt-10'>

    <div className='flex flex-col items-center gap-4 w-full max-w-3xl'>

      {myShopData.items.map((item) => (
        <OwnerItemCard
          data={item}
          key={item._id}
        />
      ))}

    </div>

  </div>
)}



        </div>

      )}

    </div>
  )
}

export default OwnerDashboard 