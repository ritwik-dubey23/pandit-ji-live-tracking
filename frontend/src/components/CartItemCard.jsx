import React from 'react'
 import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";

 import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

 
function CartItemCard({data}) {
  const dispatch=useDispatch();
  
  
  const  handleIncrease=(id,currentQty)=>{
    
     
          dispatch(updateQuantity({id,quantity:currentQty+1}))
    
    
     
    

  }
  
  const  handleDecrease=(id,currentQty)=>{
    if(currentQty>1){
      
          dispatch(updateQuantity({id,quantity:currentQty-1}))

    }
    
    
  }
  
  
  
  
  return (
    <div   className='flex items-center justify-between
shadow border  
bg-white p-4 rounded-2xl'
>
      
      
      
      <div className='flex items-center gap-4'>
        <img src={data.image} alt='Food image'  
className='w-20 h-20 object-cover rounded-lg
border'>
        </img>
        
        <div>
            
            <h1 className='capitalize font-medium text-gray-800'>{data.name}</h1>
       
       <p className='text-sm  text-gray-500'>
        
     ₹{data.price} × {data.quantity}
       </p>
       
       <p className='font-bold text-gray-900'>
        
     ₹{data.price * data.quantity}
       </p>
       
        </div>
        
        
        
      </div>
      
      
      
      <div   className='flex items-center gap-3'>
        
    <button className='p-2  cursor-pointer
bg-gray-100 rounded-full hover:bg-gray-200' onClick={()=>handleDecrease(data.id,data.quantity)}>
        
        
        <FaMinus size={12} />

    </button>
    <span>
        {data.quantity}
    </span>
       
    <button className='p-2   cursor-pointer
bg-gray-100 rounded-full hover:bg-gray-200'   onClick={()=>handleIncrease(data.id,data.quantity)}>
        
        
        <FaPlus size={20}/>


    </button>
        
        <button className="p-2 bg-red-100
hover:bg-red-200 text-red-600 rounded-full"
onClick={()=>dispatch(removeCartItem(data.id))}
> <FaTrashAlt size={18} />
</button>
        
      </div>
    </div>
  )
}

export default CartItemCard






