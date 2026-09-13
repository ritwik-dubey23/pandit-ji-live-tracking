import React, { useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios  from 'axios';


import { ClipLoader }   from         "react-spinners"
function ForgotPassword() {
    const [step, setStep] = useState(1)

const navigate=useNavigate();
    const [email, setEmail] = useState("")
    
    
    const [otp,setOtp]=useState("")
    
    
    
    
    // new password and old password page
    
    
    const [newPassword,setnewPassword]=useState("")
    
    const [confirmPassword,setconfirmPassword]=useState("")
    
    
    // loding  ke liye 
    
    const [loading,setLoading]=useState(false)
    
    
    const   handleSendOtp=async()=>{
            if (!email) {
        setErr("Email is required");
        return;
    }

            setLoading(true) 
        try{
            const  result =await  axios.post(`${serverUrl}/api/auth/send-otp`,{email},{withCredentials:true})
       console.log(result);
     
     
       setStep(2)
       
       // isko step 2 otp verify pe bhej    dengeee
          setLoading(false)  
       
       
        }catch (err){
 console.log(err)     
 
    setErr(
        err?.response?.data?.message || 
        "User does not exist ,Please Create account frist.."
    ); 
      setLoading(false) 
  
        }
    }
    
    
    
    // sstep 2 verifyy
    
    
    
    const   handleVerifyOtp=async()=>{
             setLoading(true) 
        try{
            const  result =await  axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{withCredentials:true})
       console.log(result);
     
     setErr("");
     //AGAR koi error nhi aatta h tooo
     
     
     
       setStep(3)
       //###   state update hogi 3 pe to ye hoga 
       
       // isko step 2 otp verify pe bhej    dengeee
            setLoading(false) 
       
       
        }catch (error){
        setErr(error?.response?.data?.message);    
 console.log(error) 
     setLoading(false)                                                 
        }
    }
    
    
    //   step 3 to reset password in the DB
    
    
    const   handleResetPassword=async()=>{
          
        if(newPassword!=confirmPassword){
            return null
        }
        
          setLoading(true) 
        try{
              const  result =await  axios.post(`${serverUrl}/api/auth/reset-password`
       ,{email,newPassword },{withCredentials:true})
       console.log(result);
     
     // matln redirect to the signin pagee
       navigate("/signin")
       
   setErr("");
       
           setLoading(false) 
        }catch (error){
 console.log(error)   
 
   console.log("FULL ERROR:", error);
  console.log("BACKEND RESPONSE:", error.response?.data);
       
 setErr(error?.response?.data?.message);
 
 
     setLoading(false) 
        }
    }
    
    // Error
        const[err,setErr]=useState("")  
    
    
    return (
        <div className='flex w-full items-center justify-center h-[80vh] p-4 bg-[#fff9f9]'>
            <div className='bg-white  rounded-xl  shadow-lg w-full  max-w-md p-8'>
                <div className='flex items-center gap-4  mb-4'>

                    <IoMdArrowRoundBack size={30} className="text-[#ff4d2d] cursor-pointer transition-transform duration-200 hover:scale-125"
onClick={()=>{
                        navigate("/signin")
                    }}/>
                    <h1 className='text-2xl font-bold text-center  text-[#ff4d2d]'>Forgot Password</h1>

{/* 
// step 1 for eamil input karwa ne liye */}
                </div>
                {step == 1 &&

                    <div>

                        <div className='mb-6'>
                            {/* email */}
                            <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email id </label>
                            <input type="email" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 
           shadow-sm focus:outline-none focus:ring-2 
           focus:ring-orange-400 focus:border-orange-500 transition"


                                placeholder=' Enter your Email id  here...'
                                onChange={(e) => setEmail(e.target.value)} value={email}  required
                            ></input>
                        </div>


                        <button className={`w-full font-semibold py-2 rounded-lg  mt-2 transition duration-200 bg-[#ff4d2d]
                             text-white hover:bg-[#e64323] cursor-pointer`   } onClick={handleSendOtp}  disabled={loading} >
                                
                                {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
                                </button>


{err && (
  <p className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold mt-3">
    <span>⚠️</span>
    <span>{err}</span>
  </p>
)}
                    </div>

                }
{/*                 
               ### otp wla page */}
{/*                 
                //  step 2 */}
                
           {step==2&&                    <div>

                        <div className='mb-6'>
                            {/* email */}
                            <label htmlFor="email" className='block text-gray-700 font-medium mb-1'> Enter OTP </label>
                            <input type="email" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 
           shadow-sm focus:outline-none focus:ring-2 
           focus:ring-orange-400 focus:border-orange-500 transition"


                                placeholder=' Enter the OTP  here...'
                                onChange={(e) => setOtp(e.target.value)} value={otp}   required
                            ></input>
                        </div>


                        <button className={`w-full font-semibold py-2 rounded-lg  mt-2 transition duration-200 bg-[#ff4d2d]
                             text-white hover:bg-[#e64323] cursor-pointer`}  onClick={handleVerifyOtp}  disabled={loading} >
                                
                                {loading ? <ClipLoader size={20} color="#fff" /> : "Verify"}</button>



{err && (
  <p className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold mt-3">
    <span>⚠️</span>
    <span>{err}</span>
  </p>
)}
                    </div>}
           
           {/* 
// step 3 for password seeting new  password */}
                
                {step == 3 &&

                    <div>

                        <div className='mb-6'>
                            <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password </label>
                            <input type="password" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 
           shadow-sm focus:outline-none focus:ring-2 
           focus:ring-orange-400 focus:border-orange-500 transition"


                                placeholder=' Enter your New Password  here...'
                                onChange={(e) => setnewPassword(e.target.value)} value={newPassword}    required 
                            ></input>
                        </div>


    <div className='mb-6'>
                            <label htmlFor="ConfirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password </label>
                            <input type="password" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 
           shadow-sm focus:outline-none focus:ring-2 
           focus:ring-orange-400 focus:border-orange-500 transition"


                                placeholder=' Enter your New Password  Again   here...'
                                onChange={(e) => setconfirmPassword(e.target.value)} value={confirmPassword}
                            required  ></input>
                        </div>


                        <button className={`w-full font-semibold py-2 rounded-lg  mt-2 transition duration-200 bg-[#ff4d2d]
                             text-white hover:bg-[#e64323] cursor-pointer`}  onClick={handleResetPassword}  disabled={loading} >
                                
                                {loading ? <ClipLoader size={20} color="#fff" /> : "Reset Password"} </button>



{err && (
  <p className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold mt-3">
    <span>⚠️</span>
    <span>{err}</span>
  </p>
)}
                    </div>

                }
           
            </div>
        </div>

    )
}

export default ForgotPassword