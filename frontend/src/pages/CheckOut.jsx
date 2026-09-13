import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';import { useDispatch, useSelector } from 'react-redux';
import L from "leaflet";
import  "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import { CiMobile3 } from "react-icons/ci";

import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa6";
import { addMyOrder } from '../redux/userSlice';



function RecenterMap({location}) {
  
  if(location.lat  &&  location.lon){
    const  map=useMap();
map.setView(     [location.lat, location.lon],17,{animate:true})
  }
  
  
  return null;
  
}



function CheckOut() {
  const [paymentMethod,setPaymentMethod]=useState("cod")
  
          const  apiKey=import.meta.env.VITE_GEOAPIKEY_API_KEY           

  const navigate=useNavigate();
  const {location,address}=useSelector(state=>state.map)
  


  const {cartItems,totalAmount}=useSelector(state=>state.user)

  const      deliveryFee=totalAmount>500?0:50;
  const AmountWithDeliveryFee=totalAmount+deliveryFee;
  
  
  

  const  [searchLocation,setSearchLocation]=useState("")
  const [addressInput,setAddressInput]=useState("");
  useEffect(()=>{
    setSearchLocation(address)
  },[address])
  
  const orangeIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      background-color: #ff4d2d;
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        margin: 7px;
      "></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
  
const dispatch=useDispatch();

const onDragEnd=(e)=>{
  console.log(e.target.
_latlng
)

const {lat,lng}=e.target._latlng

dispatch(setLocation({lat,lon:lng}))
getAddressByLatLng(lat,lng)

}
  


// CURRENT LOCATION LANE KE LIYE

const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch(
      setLocation({
        lat: latitude,
        lon: longitude
      })
    )
    
    
    
    
      // AFTER CUURENT LOCATION INPUT BHI UPDATE HONA CHIYYYE
    
      getAddressByLatLng(latitude,longitude);
    
  });
};




// MARKER JAHA LE JYE WHA KA ADDRESS SHOW KAREEE
const getAddressByLatLng=async (lat,lng)=>{
  
  try {
    
    const result   =await   axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
     
    
    // console.log(result?.data?.results[0].address_line2)
 
      const address = result?.data?.results?.[0]?.formatted
     
    //  input me adddress change kar dengee 

    dispatch(setAddress(address))
 
  } catch (error) {
    console.log(error)
  }
}






// LOCATION MANUALLY SEARCH KRNE KE LIYYE

const   getLatLngByAddress=async ()=>{
  
  try {
    const result=await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
  const {lat,lon}=result.data.features[0].properties
  
  // console.log(result.data.features[0].properties)
  dispatch(setLocation({lat,lon}))
  } catch (error) {
    console.log(error)
  }
  
}


useEffect(()=>{
  setAddressInput(address)
  
  
  
},[address])



// const apiKey = import.meta.env.VITE_GEOAPIKEY_API_KEY;

const serverUrl = import.meta.env.VITE_SERVER_URL;




const handlePlaceOrder=async () =>{
  
  
  try {
    const  result =await  axios.post(`${serverUrl}/api/order/place-order`,{
      paymentMethod,
      deliveryAddress:{
        text:addressInput,
        latitude:location.lat,
        longitude:location.lon
        
        
      },
      totalAmount,
      cartItems
      
    },{withCredentials:true})
    // console.log(result.data)
    
dispatch(addMyOrder(result.data))

    navigate("/order-placed")
  } catch (error) {
console.log(error);
    
  }
}












                    
  return (       
    <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center

<. 9-d'>  
   
         <div className='absolute  top-[20px] left-[20px]  z-[10]'>
        
        <IoMdArrowRoundBack  size={36}  className='text-[#ff4d2d]'  onClick={()=>
          
          navigate("/") }/>
    
        
      </div>
   <div   className='w-full max-w-[900px] bg-white rounded-2x1 shadow-x1 p-6
space-y-6'>
    
    
    <h1  className='text-2xl font-bold text-gray-800'>Check Out</h1>
    
    <section>
      <h2 className='text-lg font-semibold mb-2 flex items-center gap-2
text-gray-800'> <FaLocationDot size={25}  className='text-[#ff4d2d]'/>

Delivery Location</h2>   
      
      <div  className='flex gap-2 mb-3'>
        <input className='flex-1 border border-gray-300 rounded-lg p-2 text-sm
focus: outline-none focus:ring-2 focus:ring-[#ff4d2d]' value={addressInput || ""} placeholder='Please Enter Address of  location '
  onChange={(e) => setAddressInput(e.target.value)} >
        </input>
        <button  className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex
items-center justify-center'  onClick={getLatLngByAddress}>
          <IoMdSearch  size={19} />

        </button>
        <button  className='bg-blue-500
justify-center 
hover:bg-blue-600

text-white px-3 py-2 rounded-lg flex items-center '  onClick={getCurrentLocation}>
          <TbCurrentLocation size={19} />

        </button>
        
      </div>
   
   
   
   
   
   
   
   
   
{/*       
   MAP SECTION
    */}
   
   
   
   
   
   
   
   
   
      
{/*       
      Map leaflet wla */}
      
      <div className='rounded-xl  border  overflow-hidden'>
<div className='h-64 w-full flex items-center justify-center'>
  
  <MapContainer className={"w-full h-full"}    
    center={[location?.lat,location?.lon]}  zoom={17}>
 
 <TileLayer
attribution='&copy; <a href="https://www.openstreetmap.org/
copyright">OpenStreetMap</a> contributors'
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<RecenterMap location={location}/>
{/* 
<Marker position={[location?.lat,location?.lon]}/> */}
<Marker 
  position={[location?.lat, location?.lon]} 
  icon={orangeIcon}   draggable eventHandlers={{dragend:onDragEnd}}
/> 
 
  </MapContainer>
  </div>        
      </div>
      
      
    </section>
    
    
    
    
    
    
    
    
    
    
    
    {/* PAYMENT  */}
    
    
    
    
    
    <section>
      <h2 className='text-lg font-semibold mb-3 text-gray-800'>
        Payment Method
      </h2>
  
    
    <div  className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
    
  <div
    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
      paymentMethod === "cod"
        ? "border-[#ff4d2d] bg-orange-50 shadow"
        : "border-gray-200 hover:border-gray-300"
    }`}
 onClick={()=>setPaymentMethod("cod")} >
  <span className='inline-flex h-10 w-10 items-center justify-center rounded-full
bg-green-100 '><MdDeliveryDining className='text-green-600 text-xl  ' size={20} />
</span>

<div>
  
  <p className='font-medium   text-gray-800'>Cash On Delivery</p>
  
<p className="text-xs text-gray-500 font-medium tracking-wide">
  Pay when your food arrives at your destination
</p>
</div>
  </div>






  <div
    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
      paymentMethod === "online"
        ? "border-[#ff4d2d] bg-orange-50 shadow"
        : "border-gray-200 hover:border-gray-300"
    }`}
  onClick={()=>setPaymentMethod("online")} >
    
<span className='inline-flex h-10 w-10 items-center justify-center rounded-full
bg-purple-100'><CiMobile3   className='text-purple-700 text-lg'/>
</span>


<span  className='inline-flex h-10 w-10 items-center justify-center rounded-full
bg-blue-100'><FaCreditCard   className='text-purple-700 text-lg' />
</span>

<div>
  <p className='font-medium  text-gray-800'>UPI / Credit / Debit Card</p>
  <p   className='text-xs  text-gray-500'>  Pay Securely Online</p>
</div>

  </div>



    </div>
      </section>
      
      
      <section>
        
        <h2 className='text-lg font-semibold mb-3 text-gray-800'>
          Order Summary
        </h2>
        
     <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
          {cartItems.map((item,index)=>(
            <div  key={index}  className='flex justify-between text-sm text-gray-700'> 
            <span>{ item.name} X {item.quantity}</span>
            
            <span><b>₹ {item.price*item.quantity}</b></span>
            
            
            </div>
            
          ))}
          
          <hr className='border-gray-200 my-2'></hr>
          
          
          
          
          
          <div className='flex font-medium justify-between text-gray-900'>
            <span>Subtotal</span>
            <span>₹ {totalAmount}</span>
          </div>
          
          <div className='flex justify-between text-gray-700'>
            <span>Delivery Charges</span>
            <span>
             {deliveryFee==0?"Free":deliveryFee} 
            </span>
          </div>
          
          
          <div className='flex justify-between text-lg font-bold


text-[#ff4d2d] pt-2'>
            <span>Total</span>
            <span>₹ {AmountWithDeliveryFee}</span>
          </div>
          
          
          
          
          
        </div>
      </section>
      <button  
className='w-full bg-[#ff4d2d] hover:bg-[#e64526]
font-semibold text-white py-3 rounded-xl'  onClick={handlePlaceOrder}>
        {paymentMethod=="cod"?"Place Order ":"Pay & Place Order"}
      </button>
      
      
      
      
   </div>
   
   
   </div>
  )
}

export default CheckOut

