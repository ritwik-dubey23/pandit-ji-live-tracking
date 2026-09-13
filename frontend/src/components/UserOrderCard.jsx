import React from 'react'

function UserOrderCard({ data }) {

    const formatDate = (dateString) => {
        const date = new Date(dateString)

        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    return (
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-5'>

            {/* Top Section */}
            <div className='flex justify-between items-start border-b border-gray-500 pb-4'>

                {/* Left - Order Details */}
                <div>
                    <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                        Order ID
                    </p>

                    <p className='font-semibold text-gray-800 text-base'>
                        #{data._id.slice(-6).toUpperCase()}
                    </p>

                    <p className='text-xs text-gray-400 uppercase tracking-wide mt-3 mb-1'>
                        Order Date
                    </p>

                    <p className='font-medium text-gray-700 text-sm'>
                        {formatDate(data.createdAt)}
                    </p>
                </div>


                {/* Right - Payment + Status */}
                <div className='text-right gap-2'>

                    <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                        Payment Method
                    </p>

                    <p className='font-semibold text-gray-700 text-sm'>
                        {data.paymentMethod?.toUpperCase()}
                    </p>


                    <p className='text-xs text-gray-400 uppercase tracking-wide mt-3 mb-1'>
                        Status
                    </p>

                    <p className='font-semibold text-orange-500 text-sm'>
                        {data.shopOrders?.[0]?.status}
                    </p>

                </div>

            </div>


            {/* Items - Yaha Baad Me Map Karna */}
         <div className='pt-4 space-y-5'>

                
                {data.shopOrders?.map((shopOrder,index) => (


<div className='border rounded-lg  p-3  bg-[#fffaf7]  space-y-3' key={index}>
<p>{shopOrder.shop.name}</p>    
    
    
    
        
     <div className='flex gap-6 overflow-x-auto pb-2'>
   {shopOrder.shopOrderItems.map((item,index)=>(
    
    
    
   item.item && (
        <div
            key={index}
            className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
        >
            <img
                className='w-full h-24 object-cover rounded'
                src={item.item.image}
                alt="Food Image"
            />
            
            <p className='text-sm font-semibold mt-1'>{item.name}</p>
<p className='text-xs text-gray-500'>Qty: {item.quantity} x ₹ {item.price}</p>

        </div>
    )
    
    
   ))}
        
        
        
    </div>
    


<div className='flex justify-between items-center border-t pt-2'>
    
    <p     className='font-semibold'>Subtotal : ₹ {shopOrder.subtotal}</p>
<span className='text-sm   font-medium  text-blue-600'>{shopOrder.status}</span>


</div>
  
</div>

                ))}
               

            </div>
            
            
           
<div className='flex justify-between items-center border-t pt-2'>
               <p className='font-semibold'>Total: ₹ {data.totalAmount}</p >
               
               <button className='bg-[#ff4d2d]
hover:bg-[#e64526]

text-white px-4 py-2 rounded-lg text-sm'>Track Order</button>
            
            </div>
            
      </div>
    )
}

export default UserOrderCard


