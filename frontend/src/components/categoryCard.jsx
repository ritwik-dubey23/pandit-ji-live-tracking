import React from 'react'

function CategoryCard({ name,image }) {
  return (
    <div
      className='w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl
      border-2 border-[#ff4d2d] shrink-0 overflow-hidden
      shadow-md hover:shadow-lg transition-shadow   relative'
    >
{/* 
        // food item Image                                                                  */}




<img  src={image}  alt="Food Image" className=' w-full h-full object-cover transform
hover:scale-115 transition-transform duration-300'/>

<div className='absolute bottom-0 w-full left-0

bg-[#ffffff96]
bg-opacity-95 px-3 py-1 rounded-t-x1 text-center shadow text-sm font-medium
text-gray-800 backdrop-blur'   >
    {name}
</div>
    </div>
  )
}

export default CategoryCard