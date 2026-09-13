import React, { useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa6";
import { setCurrentCity } from '../redux/userSlice';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/owner.slice';
import axios from "axios"
import { ClipLoader } from "react-spinners";
function Additem() {
   
  
  //LOADING 
  
  const [loading,setLoading]=useState(false);
  
  
  
  
  // ERROR MESSAGE
  const [errorMessage,setErrorMessage]=useState("");
  
  
  
  const dispatch=useDispatch();
  const   navigate=useNavigate();
  const   {myShopData}=useSelector(state=>state.owner);
  
 // NAME OF    ITEMS
    const [name,setName]=useState("");
    
    
    // PRICE OF ITEMS
        const [price,setPrice]=useState("");

    

  
  // image ke liye usestate
  const   [frontendImage,setFrontendImage]=useState(null);
  const [backendImage,setBackendImage]=useState(null);
  
// TYPE OF FOOD
    const [foodType,setFoodType]=useState("veg")

  // catogries
const   [category,setCategory]=useState("");
  
  const categories=[    "Snacks",
               "Main Course",
               "Desserts",
               "Pizza",
               "Burgers",
               "Sandwiches",
               "South Indian",
               "North Indian",
               "Chinese",
               "Fast Food",
               "Others"]
  
  
  const  handleImage=(e)=>{
  
    const   file=e.target.files[0];
    setBackendImage(file);
    
    setFrontendImage(URL.createObjectURL(file));
    
    
    
  }
  
  // SAVE WALI FUNCTIONILTY KE LIYEE HANDLE SUMBIT Fn....
  
  const  handleSumbit=async(e)=>{
    e.preventDefault();
    
    
    // ERROR MESSAGES
    setErrorMessage("");

if(!name.trim()){
  setErrorMessage("Food item name is required.");
  return;
}

if(!price || Number(price) <= 0){
  setErrorMessage("Please enter a valid price.");
  return;
}

if(!category){
  setErrorMessage("Please select a category.");
  return;
}

if(!backendImage){
  setErrorMessage("Please upload food item image.");
  return;
}


    
    
      setLoading(true)
    
    try{
      const  formData =new  FormData();
      
      // Formdata is a class in js ye sab data usme appned kr ddenge  (daal denge matlb)
     
      formData.append("name", name);
    formData.append("price", price);
     
       formData.append("foodType", foodType);
         formData.append("category", category);
         
         
      if(backendImage)
{
  formData.append("image",backendImage);
  
  
} 

const result =await  axios.post(`${serverUrl}/api/item/add-item`,formData,{withCredentials:true})
dispatch(setMyShopData(result.data))
console.log(result.data);
  setLoading(false)
       
  
  //AFter getting data navgite to home after ADDING ITM
  
  navigate("/");   
       
       
    }catch (error){
      console.log(error);
  console.log("ERROR:", error);
  console.log("SERVER RESPONSE:", error.response?.data);
  setErrorMessage(
  error.response?.data?.message ||
  "Food item could not be added. Please try again."
);
  setLoading(false)

    }
    
    
    
  }
  
  
  
  
  
  
  return (
    <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br
from-orange-50 relative to-white min-h-screen'>        
  
  
  
  
  <div 
className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'>
    
    <IoMdArrowRoundBack  size={36}  className='text-[#ff4d2d]'  onClick={()=>
      
      navigate("/") }/>

    
  </div>
{/*   
  // main  EDIT box .. */}
  
  
  <div  className='max-w-1g w-full
bg-white shadow-x1 rounded-2x1 p-8 border border-orange-100  bg-white p-6 rounded-xl shadow-md'> 
    
    
    <div className='flex flex-col items-center mb-6'>
    <div   className='bg-orange-100 p-4 rounded-full mb-4'> 
      
     <FaUtensils size={27}  className='text-[#ff4d2d] w-16 h-16' />
 
      
    </div>
    <div   className= "text-4x1 font-extrabold Otext-gray-900">
     Add food items
    </div>


    
  <form  className='space-y-5'  onSubmit={handleSumbit}>
    
 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
   Food Item Name
  </label>

  <input
    type="text"
    placeholder="Enter the  Food Item Name"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
 
 onChange={(e)=>setName(e.target.value)}
 value={name}
 
 />
</div>
    
    
    
    
    
     
 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
   Price of FoodItem
  </label>

  <input
    type="number"
    placeholder="Enter the  Food Item Price"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
 
onChange={(e) => setPrice(Number(e.target.value))}
 value={price}
 
 />
</div>
    
     
     
       
    
     
 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
   Select Category
  </label>

  <select

    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
 
onChange={(e) => setCategory((e.target.value))}
 value={category}
 
 > 
 <option  value=""> Select Category



{/*   
  // printing all array elements  */}



 </option>
 {categories.map((cate,index)=>
(
  <option value={cate} key ={index}>{cate}</option>
)
)}
 </select>
</div>
   
{/*    
   //   FOOD TYPE VEG   NONVEG */}
 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
   Select Food Type
  </label>

  <select

    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
 
onChange={(e) => setFoodType((e.target.value))}
 value={foodType}
 
 > 
<option value="veg"> Veg</option>


<option value="non veg">Non-Veg</option>

 </select>
</div>
       
       
       
       
       
       
    <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
     Upload  Food Items images
  </label>

  <input
    type="file"  accept='image/*'
    placeholder="Upload Shop image"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
  onChange={handleImage}
  />

{/* 
SHOP IMAGE DIISPALY   */}
{/* SHOP IMAGE DISPLAY */}
{frontendImage && (
  <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
    <img
      src={frontendImage}
      alt="Shop image"
      className="w-full h-48 object-cover"
    />
  </div>
)}
  
</div>


<div className='grid grid-cols-1 md: grid-cols-2 gap-4'>
  


</div>

{/*  
 ERROR MESSAGE */}
 
{errorMessage && (
  <p className="text-red-500 text-md font-medium text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
   <b>{errorMessage}  </b> 
  </p>
)}

<button  className='w-full bg-[#ff4d2d]
font-semibold shadow-md
duration-200

text-white px-6 py-3 rounded-1g
hover:bg-orange-600 hover: shadow-1g transition-all cursor-pointer' 


// onClick={()=>
      
//       navigate("/") }
      >


         Save</button>
  </form>
 
 
 </div>
  



{/*     
    // Main from   to Add  Shop (new) */}

<div>
   
           
  
</div>



</div>

</div>
  )
}

export default Additem







