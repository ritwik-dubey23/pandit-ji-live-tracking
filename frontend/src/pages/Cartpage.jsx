import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FaShoppingCart } from "react-icons/fa";         
import CartItemCard from '../components/CartItemCard';
function Cartpage() {
    
    
    const navigate=useNavigate();
   const  {cartItems,totalAmount}=useSelector(state=>state.user);
   
    
  return (
    <div className='min-h-screen


bg-[#fff9f6] flex justify-center p-6'>

<div className='w-full max-w-[800px]'>
<div className='flex items-center gap-[20px] mb-6'>
      
      <div className='z-[10]'>
        
        <IoMdArrowRoundBack  size={36}  className='text-[#ff4d2d]'  onClick={()=>
          
          navigate("/") }/>
    
        
      </div>
      
          <h1  className='text-2x1 font-bold text-start'> Your Cart</h1>
      </div>
{cartItems?.length==0?(
    <p className="flex items-center justify-center gap-2 text-gray-600 text-lg font-semibold">
  <FaShoppingCart className="text-[#ff4d2d] text-xl" />
  Your Cart is Empty
</p>):(
  <>
  <div className='space-y-5'>
    {cartItems?.map((item,index)=>(
        <CartItemCard data={item} key={index}/>
        
    ))}
</div>

<div   className='mt-6 bg-white p-4 rounded-2xl shadow flex
justify-between items-center border'>
  <h1 className='text-lg font-semibold'> Total Amount  </h1>

<span className='text-xl  font-bold text-[#ff4d2d]'> ₹ {totalAmount}</span>
</div>

<div className='mt-4 flex justify-end'>
  <button className='bg-[#ff4d2d] cursor-pointer
hover:bg-[#e64526] transition  text-white px-6 py-3 rounded-lg text-lg

font-medium'onClick={()=>navigate('/checkOut')}>
 Proceed to           Check Out
  </button>
</div>

</>)

}
</div>



</div>
  )
}

export default Cartpage

