import React from "react";
import Navbar from "./Navbar.jsx";
import { useSelector } from "react-redux";

function DeliveryBoyDashboard() {
  const  {userData}=useSelector(state=>state.user)
  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">

      <Navbar />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center mt-[100px]">

        <div className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center w-[90%] border border-orange-100">

          <h1 className="text-2xl font-bold text-gray-800">
            Welcome ,{userData.fullName}
          </h1>

        </div>

      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;