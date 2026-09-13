// import React from 'react'
// import { FaPhone } from "react-icons/fa";

// function OwnerOrderCard({data}) {
    
    
// console.log("ITEM DATA:", data?.shopOrders?.shopOrderItems);
    
//   return (
//     <div   className=' bg-white rounded-lg shadow p-4 space-y-4'>
        
//         <div>
//           <h2 className='text-lg font-semibold  text-gray-800'><b>{data.user.fullName}</b></h2>
        
//         <p className='text-sm   text-gray-500'>{data.user.email}</p>
        
//         <p  className='flex items-center gap-2 text-sm text-gray-600 mt-1'><FaPhone />
// <span>{data.user.mobile}</span></p>
//         </div>
         
        
//       <div  className='flex items-start flex-col gap-2 text-gray-600 text-sm'>
        
//         <p>{data.deliveryAddress?.text}</p>
//         <p className='text-xs text-gray-500'>
//   Lat:     {data?.deliveryAddress?.latitude},Lon:{data?.deliveryAddress?.longitude}     
//         </p>
//         </div>  
        
        
// <div className='flex gap-6 overflow-x-auto pb-2'>

//   {data.shopOrders?.shopOrderItems?.map((item, index) => (
//     item.item && (
//       <div
//         key={index}
//         className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
//       >
//         <img
//           className='w-full h-24 object-cover rounded'
//           src={item.item.image}
//           alt="Food Image"
//         />

//         <p className='text-sm font-semibold mt-1'>
//           {item.item.name}
//         </p>

//         <p className='text-xs text-gray-500'>
//           Qty: {item.quantity} x ₹ {item.price}
//         </p>
//       </div>
//     )
//   ))}

// </div>
        
        
        
//     </div>
//   )
// }






// export default OwnerOrderCard
import React from 'react'
import { FaPhone } from "react-icons/fa";
import { serverUrl } from '../App';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react'; 
function OwnerOrderCard({ data }) {
  const [availableBoys, setAvailableBoys] =  useState([]);  
  
const dispatch =useDispatch();
  const shopOrders = Array.isArray(data?.shopOrders)
    ? data.shopOrders
    : data?.shopOrders
      ? [data.shopOrders]
      : [];

  const orderItems = shopOrders.flatMap((shopOrder) => shopOrder?.shopOrderItems || []);
  const shopOrder = shopOrders[0];

   
  
  const     handleUpdateStatus = async (orderId, shopId, status) => {
  
  try{
    const    result  =await  axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status },{withCredentials:true});
 console.log(result)
 dispatch(updateOrderStatus({ orderId, shopId, status }));
 
 setAvailableBoys(result.data.availableBoys);
 console.log(result.data);
 
 
  }catch(error){
 console.error("Error updating order status:", error);
  } }
  
  
  
  
  return (
    
    
    
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>

      <div>
        <h2 className='text-lg font-semibold text-gray-800'><b>{data.user.fullName}</b></h2>
        <p className='text-sm text-gray-500'>{data.user.email}</p>
        <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
          <FaPhone />
          <span>{data.user.mobile}</span>
        </p>
      </div>

      <div className='flex items-start flex-col gap-2 text-gray-600 text-sm'>
        <p>{data.deliveryAddress?.text}</p>
        <p className='text-xs text-gray-500'>
          Lat: {data?.deliveryAddress?.latitude}, Lon: {data?.deliveryAddress?.longitude}
        </p>
      </div>

      <div className='flex gap-6 overflow-x-auto pb-2'>
        {orderItems.length > 0 ? orderItems.map((item, index) => (
          (item.item || item.name) && (
            <div key={index} className="shrink-0 w-40 border rounded-lg p-2 bg-white">
              <img className='w-full h-24 object-cover rounded' src={item.item?.image || item.image} alt={item.item?.name || item.name || 'Food'} />
              <p className='text-sm font-semibold mt-1'>{item.item?.name || item.name}</p>
              <p className='text-xs text-gray-500'>Qty: {item.quantity} x ₹ {item.price}</p>
            </div>
          )
        )) : (
          <p className='text-sm text-gray-500'>No items found for this order.</p>
        )}
      </div>



<div  className='flex justify-between items-center border-t pt-3 border-gray-300'>
  <span className='text-sm'> Status:   <span className='font-semibold capitalize text-[#ff4d2d]'>{shopOrder?.status}</span></span>
  
</div>
<select  className='w-full border rounded-lg p-2 mt-2 text-sm text-gray-600' value={shopOrder?.status || ''} onChange={(e)=>handleUpdateStatus(data._id, shopOrder?.shop?._id, e.target.value)}>
    <option value="">Change Status  </option>

  <option value="pending">Pending</option>
  < option value="preparing">Preparing</option>
  <option value="out of delivery">Out of Delivery</option>
</select>


{data.shopOrders.status === "out of delivery" && (
  <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">
    
    <p>Available Delivery Boys:</p>

    {availableBoys?.length > 0 ? (
      availableBoys.map((b, index) => (
       <div key={b.id || index} className="text-gray-800">
  {b.fullName} -{" "}
  <a
    href={`tel:${b.mobile}`}
    className="text-blue-600 underline"
  >
    📞 Call:    {b.mobile} 
  </a>
</div>
      ))
    ) : (
      <div>Waiting for the Delivery Boys To Accept</div>
    )}

  </div>
)}


<div className='flex justify-between items-center border-t pt-3 border-gray-300'>
  Total Amount: <span className='font-semibold text-[#ff4d2d]'>₹ {shopOrder?.subtotal}</span>
  
  
  
</div>

    </div>
  )
}

export default OwnerOrderCard


