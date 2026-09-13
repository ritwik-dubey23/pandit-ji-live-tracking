import React, { useState } from 'react'

// for showpasssword or not funtionlityy
import { FaEye } from "react-icons/fa";

// Google authenticationn

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../../firebase.js";


import { FaEyeSlash } from "react-icons/fa";

import axios from 'axios';

import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function SignIn() {

    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f9";
    const borderColor = "#ddd";



    //  shoow wale icon ke liye use state eye wale icon ko click kreneg to hi password dekhe ga
    const [showPassword, setShowPassword] = useState(false)



    // role selcet krne ke liye 




    // sigin page pe bajne ke liyyye
    const navigate = useNavigate();

    
    // 
    
    
  
    
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
 

    // Error ke liye usestate
    const[err,setErr]=useState("")    
    
    
    // Loderr ke liyeee
    
    
    
        const [loading,setLoading]=useState(false)
        const      dispatch=useDispatch();  
    const handleSignIn=async()=>{
  
        setLoading(true)
        try {
            // redux me data update krne ke liye e


            const result = await axios.post(`${serverUrl}/api/auth/signin`,{
                email,password
                
            },{withCredentials:true})
            
            
            // data save in reduxx
            //REDUXXXX
               dispatch(setUserData(result.data))
            console.log(result)
         
           
           
            setErr("");
           setLoading(false) 
        }catch(error){
     console.log("ERROR:", error?.response?.data || error.message);  // error bta dega ye error.response         
 setErr(error?.response?.data?.message);      
         setLoading(false) }
    }
    

    
    
    
    // Google authentication
    
    
    const  handleGoogleAuth=async ()  =>{
        try{
        const  provider = new  GoogleAuthProvider();
        const   result =  await signInWithPopup(auth,provider);
        
        
       
        // data fetch krenge frontend se   Google auth se jo aya h
        const  {data}=await  axios.post(`${serverUrl}/api/auth/google-auth`,{
            

            email:result.user.email,
       
        },{withCredentials:true})
        
           // data save in reduxx
            //REDUXXXX
           dispatch(setUserData(data))
           console.log(data);
       
       
       
        }catch(error){
             console.log(error);  
        }
        
     
        
        
        
        
    }
    
    
    
    
    return (


        <div className='min-h-screen w-full flex  items-center justify-center p-4 ' style={{ backgroundColor: bgColor }}>


            <div className={`bg-white rounded-xl shadow-lg  w-full max-w-md p-8 border- [1px] `} style={{ border: `2px solid ${borderColor}` }}>
                <h1 className={`text-3xl font-bold mb-2 `} style={{ color: primaryColor }}>Vingo</h1>

                <p className='text-gray-600 mb-8'>Sign In to your account to enjoy delicious food</p>




                {/* form for sginIN login 
 
                {/* ###n  e(variable ) e,target.value se value nikkale ge like from ko sumbit krwa ke krte the 
                 */}
                
            
                <div className='mb-4'>
                    {/* email */}
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email id </label>
                    <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none  focus:border-orange-500'
                    
                    
                    placeholder=' Enter your Email id  here...' style={{ border: `2px solid ${borderColor}` }}
                    onChange={(e)=>setEmail(e.target.value)} value={email}
                    required ></input>
                </div>

              



                {/*    
   Password */}
                <div className='mb-4'>


                    <label htmlFor="fullname" className='block text-gray-700 font-medium mb-1'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className='w-full border rounded-lg px-3 py-2 focus:outline-none  focus:border-orange-500' placeholder=' Enter your  password here...' 
                        style={{ border: `2px solid ${borderColor}` }}
                        onChange={(e)=>setPassword(e.target.value)} value={password}  required
                        ></input>

                        {/* eye icon */}
                        {/* agar falsee h yye ye dekhe ga showlrne wla eye    icon */}
                        <button className='absolute top-1/2 right-3 -translate-y-1/2  cursor-pointer text-gray-500'


                            onClick={() => {
                                setShowPassword(prev => !prev)
                            }}



                        >{!showPassword ? <FaEye />
                            : <FaEyeSlash />}</button>
                    </div>
                </div>

<div  className='text-right mb-4 text-[#ff4d2d]  font-medium' onClick={()=>
    
    navigate("/forgot-password")
    
}>Forgot password</div>

                <button className={`w-full font-semibold py-2 rounded-lg  mt-2 transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}  onClick={handleSignIn}  disabled={loading}> 
                    
                    {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"} </button>


{/* Error */}
{err && (
  <p className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold mt-3">
    <span>⚠️</span>
    <span>{err}</span>
  </p>
)}


                <button className='w-full mt-5 flex items-center  justify-center gap-2 border
    rounded-lg px-4 py-2  tarnsition duration-200  border-gray-400 hover:bg-gray-300
    
    '    onClick={handleGoogleAuth}><FcGoogle size={20}   />
                    <span>Sign In with Google</span>

                </button>
                <p 
                  
                onClick={
                ()=>navigate("/signup")}
                
             className=   '    cursor-pointer    text-center  mt-5'> Want to Create a new  account ? <span className='text-[#ff4d2d]'><b>Sign Up</b></span></p>
            
</div>
    </div>

        


    )
}

export default SignIn