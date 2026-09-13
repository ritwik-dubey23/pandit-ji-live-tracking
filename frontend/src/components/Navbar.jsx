import React, { useEffect, useState } from "react";
import axios from "axios";

import { IoLocationSharp, IoClose } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaSearch, FaPlusCircle } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";

import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

import { LuReceiptIndianRupee } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { userData, currentCity ,cartItems} = useSelector(state => state.user);
  
  const isDeliveryBoy = userData?.role === "deliveryBoy";

const   navigate=useNavigate();
  const { myShopData } = useSelector(state => state.owner);
  const isUser = userData?.role === "user";
  const isOwner = userData?.role === "owner";

  const foodEmojis = ["🍕","🍔","🍟","🍩","🍜","🥗","🌮"];

  const [emoji, setEmoji] = useState(foodEmojis[0]);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/signOut`,
        {},
        { withCredentials:true }
      );
      dispatch(setUserData(null));
    } catch(error){
      console.log(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(()=>{
      const random =
      foodEmojis[Math.floor(Math.random()*foodEmojis.length)];
      setEmoji(random);
    },2000);

    return ()=>clearInterval(interval);
  },[]);


return (

<div className="w-full h-[70px] md:h-[80px] flex items-center px-3 md:px-6 fixed top-0 z-[9999] bg-[#fff9f6]">

{/* ================= MOBILE ================= */}
{/* ================= MOBILE ================= */}

<div className="relative flex w-full items-center md:hidden px-3 h-[60px]">

  {/* LOGO */}
  <div className="flex-1">
    <h1 className="text-xl font-bold text-[#ff4d2d]">Vingo</h1>
  </div>

  {/* SEARCH ONLY USER */}
  {showSearch && isUser && (
    <div className="absolute left-0 top-0 w-full h-full bg-white flex items-center gap-3 px-3 z-[99999]">

      <div className="flex items-center gap-2 border-r pr-3" >
        <IoLocationSharp size={25} className="text-[#ff4d2d]" />
        <span>{currentCity}</span>
      </div>

      <span className="text-3xl">{emoji}</span>

      <input
        autoFocus
        placeholder="Search delicious food..."
        className="flex-1 outline-none"
      />

      <IoClose
        size={28}
        className="text-[#ff4d2d]"
        onClick={() => setShowSearch(false)}
      />
    </div>
  )}

  {/* RIGHT SIDE */}
  <div className="flex items-center gap-2">

    {/* USER */}
    {isUser && (
      <>
        <IoIosSearch
          size={22}
          className="text-[#ff4d2d]"
          onClick={() => setShowSearch(true)}
        />

        <div className="relative"   onClick={()=>navigate("/cart")}>
          <FaCartPlus className="text-[#ff4d2d] text-lg" />
          <span className="absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-[10px] rounded-full px-1">
          {cartItems.length}
          </span>
        </div>





        {/* My Orders */}
       
        {/* # button wla MY ORDER */}
        
        {/* <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#ff4d2d]/10 text-[#ff4d2d]">
          <LuReceiptIndianRupee size={14} />
          <span className="text-[10px] font-medium">Orders</span>
        </div> */}
      </>
    )}








    {/* OWNER */}
   {/* ✅ ADD → only when shop exists */}
{isOwner && myShopData && (
  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#ff4d2d]/10 text-[#ff4d2d]">
    <FaPlusCircle size={19} onClick={()=>navigate("/add-item")}/>
   <button  onClick={()=>navigate("/add-item")}> <span  className="text-[10px] font-medium">Add</span></button>
  </div>
)}

{isDeliveryBoy && (
  <div
    className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#ff4d2d]/10 text-[#ff4d2d] cursor-pointer"
    onClick={() => navigate("/my-orders")}
  >
    <LuReceiptIndianRupee size={20} />
    <span className="text-[10px] font-medium">My Orders</span>
  </div>
)}

{/* ✅ PENDING → always show */}
{isOwner && (
  <div className="relative flex items-center gap-1 px-2 py-1 rounded-md bg-[#ff4d2d]/10 text-[#ff4d2d]">
    <LuReceiptIndianRupee size={20} />
    <span className="text-[10px] font-medium" onClick={()=>navigate("/my-orders")}>Pending</span>

    <span className="absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-[9px] rounded-full px-1">
      0
    </span>
  </div>
)}















    {/* PROFILE */}
    <div className="relative">
      <div
        onClick={() => setShowMenu(!showMenu)}
        className="w-[32px] h-[32px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white cursor-pointer text-sm"
      >
        {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
      </div>

  {showMenu && ( 
  <div className="absolute right-0 top-10 bg-white shadow-xl rounded-xl p-3 w-[160px]"> 

    <div className="text-sm">
      {userData?.fullName}
    </div> 
 {/* My Orders */}
    {isUser && (
      <div
        className="flex items-center gap-2 text-[#ff4d2d] cursor-pointer mt-3 pt-2 border-t border-gray-100 text-sm" onClick={()=>navigate("/my-orders")}
      >
       
        <span>My Orders</span>
      </div>
    )}
    <div 
      className="text-red-500 cursor-pointer mt-2 text-sm" 
      onClick={handleLogOut} 
    > 
      Logout 
    </div>

   

  </div> 
)}



    </div>

  </div>
</div>
{/* ================= DESKTOP ================= */}

<div className="hidden md:flex w-full items-center justify-between">

<h1 className="text-3xl font-bold text-[#ff4d2d]">Vingo</h1>

{/* USER SEARCH */}
{isUser && (
<div className="flex-1 flex justify-center">
<div className="w-full max-w-[600px] h-[60px] bg-white shadow-lg rounded-xl flex items-center">

<div className="px-3 border-r">
<IoLocationSharp className="text-[#ff4d2d]"/>
{currentCity}
</div>

<div className="flex items-center gap-3 px-3 flex-1">
<span className="text-2xl">{emoji}</span>
<FaSearch className="text-gray-400"/>
<input
placeholder="Search Delicious food..."
className="flex-1 outline-none"
/>
</div>

</div>
</div>
)}

{/* OWNER ADD FOOD */}
{isOwner &&  myShopData && (
  
<div className="ml-auto mr-2">
<button className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d]"  onClick={()=>navigate("/add-item")}>
<FaPlusCircle size={22} onClick={()=>navigate("/add-item")}/>
<span>Add Food Items</span>
</button>
</div>
)}

<div className="flex items-center gap-4" >

{isUser && (
   <div className="relative"   onClick={()=>navigate("/cart")}>
          <FaCartPlus className="text-[#ff4d2d] text-lg" />
          <span className="absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-[10px] rounded-full px-1">
          {cartItems.length}
          </span>
        </div>
)}
{isUser ? (
  <button className="px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d]" onClick={()=>navigate("/my-orders")}>
    My Orders
  </button>
) : isOwner ? (
  <div className="relative flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium" onClick={()=>navigate("/my-orders")}>
    
    <LuReceiptIndianRupee size={22} onClick={()=>navigate("/my-orders")}/>
    <span>Pending Orders</span>


    {/* ✅ BADGE */}
    <span className="absolute -top-2 -right-2 bg-[#ff4d2d] text-white text-xs font-bold rounded-full px-[6px] py-[1px]">
               {cartItems.length}
    </span>

  </div>
) : null}

<div className="relative">

<div
onClick={()=>setShowMenu(!showMenu)}
className="w-[40px] h-[40px] rounded-full bg-[#ff4d2d] text-white flex items-center justify-center cursor-pointer"
>
{userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
</div>

{showMenu && (
<div className="absolute right-0 top-12 bg-white shadow-xl rounded-xl p-4 w-[180px]">
<div>{userData?.fullName}</div>
<div
onClick={handleLogOut}
className="text-red-500 cursor-pointer mt-2"
>
Logout
</div>
</div>
)}

</div>

</div>
</div>

</div>
)

}

export default Navbar;



