import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";   // apne actual path se
import { categories } from "../category";
import CategoryCard from "./categoryCard";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";



function UserDashboard() {
  // cate MEANS    CATEGORYYY
const   cateScrollRef =useRef()
// cuurent city of user ke liyee

const    {  currentCity,shopInMyCity,itemsInMyCity} =useSelector(state=>state.user);

//CATEGORIES KE LIYEE
// left RIght bUtton ke liyyye

const     [showLeftcatebtn,setShowLeftcatebtn]=useState(false);

// left RIght bUtton ke liyyye

const     [showRightcatebtn,setShowRightcatebtn]=useState(false);



























// SHOPS lana h  CITY KE HISAB SEE

const   shopScrollRef =useRef()

const     [showLeftShopbtn,setShowLeftShopbtn]=useState(false);

// left RIght bUtton ke liyyye

const     [showRightShopbtn,setShowRightShopbtn]=useState(false);




const     updateButton=(ref,setLeftbutton,setRighbutton)=>{
  const   element =ref.current 
  if(element ){
    
    // console.log(element.scrollLeft)
   
  // #####   for left btn hding
  setLeftbutton(element.scrollLeft>0);
  
  // console.log(element.clientWidth);
 
// #### for right btn hiding

setRighbutton(
  Math.ceil(element.scrollLeft + element.clientWidth) < element.scrollWidth
)
}
}


const   scrolHandler=(ref,direction)=>{
  if(ref.current){
    ref.current.scrollBy({
      left:direction=="left"?-200:200,
      behavior:"smooth"
    })
  }
}  




useEffect(() => {
  const cateEl = cateScrollRef.current;
  const shopEl = shopScrollRef.current;

  const cateHandler = () => updateButton(cateScrollRef, setShowLeftcatebtn, setShowRightcatebtn);
  const shopHandler = () => updateButton(shopScrollRef, setShowLeftShopbtn, setShowRightShopbtn);

  if (cateEl) {
    updateButton(cateScrollRef, setShowLeftcatebtn, setShowRightcatebtn);
    cateEl.addEventListener("scroll", cateHandler);
  }

  if (shopEl) {
    updateButton(shopScrollRef, setShowLeftShopbtn, setShowRightShopbtn);
    shopEl.addEventListener("scroll", shopHandler);
  }

  return () => {
    if (cateEl) cateEl.removeEventListener("scroll", cateHandler);
    if (shopEl) shopEl.removeEventListener("scroll", shopHandler);
  };
}, [categories, shopInMyCity]);









// useEffect(() => {

//   if (cateScrollRef.current) {

//     updateButton(
//       cateScrollRef,
//       setShowLeftcatebtn,
//       setShowRightcatebtn
//     );

//     cateScrollRef.current.addEventListener("scroll", () => {
//       updateButton(
//         cateScrollRef,
//         setShowLeftcatebtn,
//         setShowRightcatebtn
//       );
//     });

//   }

//   if (shopScrollRef.current) {

//     updateButton(
//       shopScrollRef,
//       setShowLeftShopbtn,
//       setShowRightShopbtn
//     );

//     shopScrollRef.current.addEventListener("scroll", () => {
//       updateButton(
//         shopScrollRef,
//         setShowLeftShopbtn,
//         setShowRightShopbtn
//       );
//     });

//   }

// }, []);



// return () => {
//   cateScrollRef.current.removeEventListener("scroll", () => {
//     updateButton(
//       cateScrollRef,
//       setShowLeftcatebtn,
//       setShowRightcatebtn
//     );
//   });

//   shopScrollRef.current.removeEventListener("scroll", () => {
//     updateButton(
//       shopScrollRef,
//       setShowLeftShopbtn,
//       setShowRightShopbtn
//     );
//   },[categories]);
// };
console.log("ITEMS:", itemsInMyCity);
  
  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      
      <Navbar />

      {/* baaki dashboard content yaha aayega, navbar fixed hai isliye niche pt-[80px] dena */}

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] pt-[90px]">
    {/* food cards, categories, etc. */}

        <h1 className='text-gray-800 text-2xl sm:text-3xl'>
       What are you craving today?
        </h1>

<div className="w-full   relative">

{showLeftcatebtn  &&
<button
  className='absolute left-2 top-1/2 -translate-y-1/2
  w-10 h-10 flex items-center justify-center
  rounded-full bg-[#ff4d2d] text-white
  shadow-lg hover:bg-[#e64528]
  hover:scale-110 transition-all duration-200
  z-10' onClick={()=>scrolHandler(cateScrollRef,"left")}
>
  <FaChevronCircleLeft size={28} />
</button>
}









  <div className='w-full flex overflow-x-auto gap-4 pb-2'   ref={cateScrollRef}>
     {categories.map((cate,index)=>(
    <CategoryCard name={cate.category} image ={cate.image} key ={index}/>
  ))}
</div>
{showRightcatebtn &&

<button    className='absolute right-2 top-1/2 -translate-y-1/2
  w-10 h-10 flex items-center justify-center
  rounded-full bg-[#ff4d2d] text-white
  shadow-lg hover:bg-[#e64528]
  hover:scale-110 transition-all duration-200
  z-10 ' onClick={()=>scrolHandler(cateScrollRef,"right")}><FaChevronCircleRight size={28}/>
</button>
}
 </div>

      </div>




{/* 
// shop wla card banye ge  */}
   
   <div   className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] ">
      <h1 className='text-gray-800 text-2xl sm:text-3xl'>
       Best Shops in {currentCity}
        </h1>
        
    
        {/* food cards, categories, etc. */}

<div className="w-full   relative">

{showLeftShopbtn  &&
<button
  className='absolute left-2 top-1/2 -translate-y-1/2
  w-10 h-10 flex items-center justify-center
  rounded-full bg-[#ff4d2d] text-white
  shadow-lg hover:bg-[#e64528]
  hover:scale-110 transition-all duration-200
  z-10' onClick={()=>scrolHandler(shopScrollRef,"left")}
>
  <FaChevronCircleLeft size={28} />
</button>
}









  <div className='w-full flex overflow-x-auto gap-4 pb-2'   ref={shopScrollRef}>
     {shopInMyCity?.map((shop,index)=>(
    <CategoryCard name={shop.name} image={shop.image} key ={index}/>
  ))}
</div>
{showRightShopbtn &&

<button    className='absolute right-2 top-1/2 -translate-y-1/2
  w-10 h-10 flex items-center justify-center
  rounded-full bg-[#ff4d2d] text-white
  shadow-lg hover:bg-[#e64528]
  hover:scale-110 transition-all duration-200
  z-10 ' onClick={()=>scrolHandler(shopScrollRef,"right")}><FaChevronCircleRight size={28}/>
</button>
}
 </div>

      </div>
      
      
      
      
      
      
      
{/*       
  ####    PRODUCTS WLA DIV */}

<div className="w-full max-w-6xl flex flex-col gap-5 items-start px-[10px]">

  <h1 className="text-gray-800 text-2xl sm:text-3xl">
    Suggested Food Items
  </h1>

<div className="w-full flex flex-wrap gap-5 justify-start max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">    {itemsInMyCity?.map((item, index) => (
      <FoodCard key={index} data={item} />
    ))}
  </div>

</div>









   </div>
   
   

  );
}

export default UserDashboard;