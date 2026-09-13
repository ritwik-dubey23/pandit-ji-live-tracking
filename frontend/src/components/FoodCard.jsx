import React from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa6";
import { FaStar, FaRegStar } from "react-icons/fa";   // FaStar add kiya
import { FaMinus } from "react-icons/fa";
import { useState } from 'react';
 import { FaPlus } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
           




function FoodCard({ data }) {
// redux ke liyyye

const   dispatch=useDispatch();


const     {cartItems}=useSelector(state=>state.user);


    const [quantity,setQuantity]=useState(0);
    
    
  const renderstar = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating
          ? <FaStar key={i} className='text-amber-500 text-lg' />
          : <FaRegStar key={i} className='text-amber-500 text-lg' />
      );
    }
    return stars;
  };

  
  
  const   handleIncrease=()=>{
    
    
    const  newQty=quantity+1;
    
    setQuantity(newQty);
    
  }
  
  
  
  const   handleDecrease=()=>{
    if(quantity>0){
    const  newQty=quantity-1;
    
    setQuantity(newQty);
    }
    
  }
  
  
  
  return (
    <div className='w-[250px] max-sm:w-full rounded-2xl border-2 border-[#ff4d2d]
    overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all    active:shadow-2xl   duration-300 flex flex-col'>
<div className='bg-white relative w-full h-[170px] max-sm:h-[120px] flex justify-center items-center'>
  
  
  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-black/5">
  {data.foodType === "veg" ? (
    <FaLeaf className="text-green-700 text-lg" />
  ) : (
    <FaDrumstickBite className="text-red-600 text-lg" />
  )}
</div>

        <img src={data.image} alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-115 bg-white' />
      </div>

      <div className='flex-1 flex flex-col p-4'>
        <h1 className='capitalize font-medium text-gray-800 text-base truncate'>
          {data.name}
        </h1>
      </div>

   <div className='flex items-center justify-between mt-1 px-4 pb-3'>
  <div className='flex items-center gap-0.5'>
    {renderstar(data.rating?.average || 0)}
  </div>
  <span className='flex items-center bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-md'>
    {data.rating?.count || 0}
  </span>
</div>









{/* 
// SAHI: */}


<div className='flex items-center justify-between mt-auto px-4 pt-2 pb-4'>  <span className='font-bold text-gray-900 text-lg'>
        
        {data.price}
    </span>

<div className='flex items-center border rounded-full overflow-hidden shadow-sm'>
    <button  className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleDecrease}>
        
        
        <FaMinus size={12} />

    </button>
    <span>
        {quantity}
    </span>
    
     <button  className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleIncrease}>
        
        
        <FaPlus size={20}/>


    </button>
    
    
    <button className={` ${cartItems.some(i=>i.id==data._id)?"bg-gray-800":"bg-[#ff4d2d]"}



text-white px-3 py-2 transition-colors`}  onClick={()=>{
    
    
    
    quantity>0?dispatch(addToCart({
  
  
    id: data._id,
                    name: data.name,
                    price: data.price,
                    image: data.image,
                    shop: data.shop,
                    quantity,
                    foodType: data.foodType



    
})):null}}>
        <FaCartPlus size={17} />

    </button>
</div>
</div>
    </div>
  );
}

export default FoodCard;