import React from 'react'
import { MdEdit } from "react-icons/md";
import { MdCurrencyRupee } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/owner.slice';
import axios from 'axios';

function OwnerItemCard({data}) {
const navigate=useNavigate()
    // console.log("ITEM DATA:", data)
    // console.log("IMAGE URL:", data?.image)

const   dispatch=useDispatch();

const handleDelete = async () => {
    try {

        const result = await axios.delete(
            `${serverUrl}/api/item/delete/${data._id}`,
            {
                withCredentials: true
            }
        );
                            
        dispatch(setMyShopData(result.data));

    } catch (error) {
        console.log(error);
        console.log("DELETE ERROR:", error.response?.data);
    }
}
    return (
        <div className='flex bg-white rounded-2xl shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl'>

            <div className='w-36 h-36 flex-shrink-0 bg-gray-50'>
                <img
                    src={data.image}
                    alt={`food image of ${data.name}`}
                    className='w-full h-full object-cover'
                />
            </div>

            <div className='flex flex-col justify-between p-3 flex-1'>

                <div>
<h2 className='text-xl sm:text-2xl font-bold text-[#ff4d2d] capitalize mb-1'>
  {data.name}
</h2>

                    <p>
                        <span className='font-medium text-gray-700'>
                            Category: {data.category}
                        </span>
                    </p>

                    <p className='font-medium text-gray-700 capitalize'>
                        Food Type: {data.foodType}
                    </p>

                    {/* Price Food Type ke niche */}
                    <div className='flex items-center mt-2 font-semibold text-gray-700'>
                        <b className='mr-1'>Price:</b>
                        <MdCurrencyRupee />
                        {data.price}
                    </div>
                </div>

            </div>

            {/* Edit + Delete */}
            <div className='flex flex-col justify-between items-center p-3'>

                <MdEdit
                    className='text-blue-500 text-xl cursor-pointer hover:scale-140  transition'onClick={()=>navigate(`/edit-item/${data._id}`)}
                />

                <FaTrashAlt
                    className='text-red-500 text-lg cursor-pointer hover:scale-135 transition'onClick={handleDelete}
                />

            </div>

        </div>
    )
}

export default OwnerItemCard