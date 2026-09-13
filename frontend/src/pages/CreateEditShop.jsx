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

function CreateEdit() {
  const dispatch=useDispatch();
  const   navigate=useNavigate();
  const   {myShopData}=useSelector(state=>state.owner);
  const [loading ,setLoading]=useState(false);
  
  
  // ERROR MESSAGE
  const [errorMessage, setErrorMessage] = useState("");
  
    const   {currentAddress, currentState, currentCity}=useSelector(state=>state.user);
 
 
    const [name,setName]=useState(myShopData?.name||"");
  const  [address,setAddress]=useState(myShopData?.address||currentAddress);
  
  const  [City,setCity]=useState(myShopData?.city||currentCity);
  
  const [state,setState]=useState(myShopData?.state||currentState);
  
  // image ke liye usestate
  const   [frontendImage,setFrontendImage]=useState(myShopData?.image||null);
  const [backendImage,setBackendImage]=useState(null);
  
  const  handleImage=(e)=>{
    
    const   file=e.target.files[0];
    setBackendImage(file);
    
    setFrontendImage(URL.createObjectURL(file));
    
    
    
  }
  
  // SAVE WALI FUNCTIONILTY KE LIYEE HANDLE SUMBIT Fn....
  
  const  handleSumbit=async(e)=>{
    e.preventDefault();
    
    
    setErrorMessage("");

if(!name.trim()){
  setErrorMessage("Shop name is required.");
  return;
}

if(!City.trim()){
  setErrorMessage("City is required.");
  return;
}

if(!state.trim()){
  setErrorMessage("State is required.");
  return;
}

if(!address.trim()){
  setErrorMessage("Shop address is required.");
  return;
}

if(!myShopData && !backendImage){
  setErrorMessage("Please upload shop image.");
  return;
}


    
    
    
    
    setLoading(true);
    
    try{
      const  formData =new  FormData();
      
      // Formdata is a class in js ye sab data usme appned kr ddenge  (daal denge matlb)
     
     
     
      formData.append("name",name);
       formData.append("city",City);
       formData.append("state",state);
       
      formData.append("address",address);
      if(backendImage)
{
  formData.append("image",backendImage);
  
  
} 

const result =await  axios.post(`${serverUrl}/api/shop/create-edit`,formData,{withCredentials:true})
dispatch(setMyShopData(result.data))

// console.log(result.data);
setLoading(false);   
navigate("/");                
    }catch (error){
      console.log(error);
  console.log("ERROR:", error);
  console.log("SERVER RESPONSE:", error.response?.data);
  
  
  
  setErrorMessage(
    error.response?.data?.message ||
    "Shop could not be saved. Please try again."
  );
  
  
setLoading(false);
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
      {myShopData?"Edit Shop":"Add Shop"}
    </div>


    
  <form  className='space-y-5'  onSubmit={handleSumbit}>
    
 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Name
  </label>

  <input
    type="text"
    placeholder="Enter the Shop Name"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
 
 onChange={(e)=>setName(e.target.value)}
 value={name}
 
 />
</div>
    
    
       
    <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
     Upload Shop image
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
  
  <div>  <label className="block text-sm font-medium text-gray-700 mb-1">
    City
  </label>

  <input
    type="text"
    placeholder="Enter the City"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
  onChange={(e)=>setCity(e.target.value)}
 value={City}
 
 
  
  />
  
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
    State
  </label>

  <input
    type="text"
    placeholder="Enter the State"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
  
  onChange={(e)=>setState(e.target.value)}
 value={state}
 
 
  
  />
  </div>
</div>




<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Shop Address
  </label>

  <input
    type="text"
    placeholder="Enter the Shop Address"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
 onChange={(e)=>setAddress(e.target.value)}
 value={address}
 
 
 />
</div> 

{errorMessage && (
  <p className="text-red-500 text-md  font-medium text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
   <b> {errorMessage}  </b>
  </p>
)}

<button  className='w-full bg-[#ff4d2d]
font-semibold shadow-md
duration-200

text-white px-6 py-3 rounded-1g
hover:bg-orange-600 hover: shadow-1g transition-all cursor-pointer'disabled={loading}> {loading?<ClipLoader size={25} color='white'/>:"Save"}</button>
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

export default CreateEdit







