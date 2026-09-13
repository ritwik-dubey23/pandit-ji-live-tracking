import React, { useState } from 'react'

// for showpasssword or not funtionlityy
import { FaEye } from "react-icons/fa";


import { FaEyeSlash } from "react-icons/fa";

import axios from 'axios';

import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from "../../firebase.js";

// REACT spinner

import { ClipLoader }   from         "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';




function SignUp() {

    const primaryColor = "#ff4d2d";
    const hoverColor = "e64323";
    const bgColor = "fff9f9";
    const borderColor = "#ddd";

//   for redux ke liye 
// USER KE DATA ko update krne ke liyeee

const   dispatch=useDispatch();

    //  shoow wale icon ke liye use state eye wale icon ko click kreneg to hi password dekhe ga
    const [showPassword, setShowPassword] = useState(false)



    // role selcet krne ke liye 
    const [role, setRole] = useState("user")



    // sigin page pe bajne ke liyyye
    const navigate = useNavigate();

    
    // 
    
    
    const [fullName,setFullName]=useState("");
    
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [mobile,setMobile]=useState("")

    
    
    
    
    // #########  for error 
    
    const [err,setErr]=useState("")
    
    
    
    
    
    // for loaderr 
    
    
    const [loading,setLoading]=useState(false)
    
    
    const handleSignUp=async()=>{
      
      // loaderrrr 
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`,{
                fullName,email,password,mobile,role
                
            },{withCredentials:true})
              
            
            //redux me save the user data
            dispatch(setUserData(result.data)) //  data UPdate ho jyega in      redux   me
              
               console.log(result)
            
            
            
               setErr("")
            setLoading(false)
        }catch(error){
            setErr(error?.response?.data?.message);    
         console.log("ERROR:", error.response.data);            
          setLoading(false); // ✅ IMPORTANT
        }
    }
    

    
    
                
    
    
    
    // Google authentication
    
    
    const  handleGoogleAuth=async ()  =>{
        
        if(!mobile){
      return setErr("Please Enter your Mobile Number.");
        }
        const  provider = new  GoogleAuthProvider();
        const   result =  await signInWithPopup(auth,provider);
        
        
        try{
        // data fetch krenge frontend se   Google auth se jo aya h
        const  {data}=await  axios.post(`${serverUrl}/api/auth/google-auth`,{
            
            fullName:result.user.displayName,
            email:result.user.email,
            role,mobile
            
        },{withCredentials:true})
        
        // redux me data save krenge ge
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

                <p className='text-gray-600 mb-8'>Create your account to enjoy delicious food</p>




                {/* form for sginup 
   ##  fullname: */}
                <div className='mb-4'>

                    <label htmlFor="fullname" className='block text-gray-700 font-medium mb-1'>Full name</label>
                    <input type="text" className='w-full border rounded-lg px-3 py-2 focus:outline-none  focus:border-orange-500' placeholder=' Enter your Name here...' style={{ border: `2px solid ${borderColor}` }} 
                     onChange={(e)=>setFullName(e.target.value)} value={fullName }   required></input>
                
                {/* ###n  e(variable ) e,target.value se value nikkale ge like from ko sumbit krwa ke krte the 
                 */}
                
                </div>
                <div className='mb-4'>
                    {/* email */}
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email id </label>
                    <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none  focus:border-orange-500'
                    
                    
                    placeholder=' Enter your Email id  here...' style={{ border: `2px solid ${borderColor}` }}
                    onChange={(e)=>setEmail(e.target.value)} value={email}
                    required ></input>
                </div>

                {/*    
   mobile  no. */}
                <div className='mb-4'>

                    <label htmlFor="fullname" className='block text-gray-700 font-medium mb-1   '>Mobile Number</label>
                    <input type="number" className='w-full border rounded-lg px-3 py-2 focus:outline-none  focus:border-orange-500' placeholder=' Enter your  Mobile Number here...'
                     style={{ border: `2px solid ${borderColor}` }}
                     
                     onChange={(e)=>setMobile(e.target.value)} value={mobile}
                   required   ></input>
                </div>



                {/*    
   Password */}
                <div className='mb-4'>


                    <label htmlFor="fullname" className='block text-gray-700 font-medium mb-1'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className='w-full border rounded-lg px-3 py-2 focus:outline-none  focus:border-orange-500' placeholder=' Enter your  password here...' 
                        style={{ border: `2px solid ${borderColor}` }}
                        onChange={(e)=>setPassword(e.target.value)} value={password}
               required          ></input>

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



                {/*    
Role of user ke liyee*/}
                <div className='mb-4'>


                    <label htmlFor="role" className='block text-gray-700 font-medium mb-1'>Select Your Role</label>
                    <div className='flex gap-2'>

                        {/*      r    ek counter h jo array ke saree element ko btna ne ka kamm krta h */}

                        {["user", "owner", "deliveryBoy"].map((r) => (
                            <button key={r} className='flex-1 border rounded-lg   px-3 py-2  text-center  font-medium transition-colors cursor-pointer'

                                onClick={() => setRole(r)}
                                style={
                                    role == r ? { backgroundColor: primaryColor, color: "white" } : { border: `1px solid ${primaryColor}`, color: "#333" }
                                }






                            >{r}</button>


                            // tarnsition smooth ke liye h
                        ))}


                    </div>
                </div>

                <button className={`w-full font-semibold py-2 rounded-lg  mt-2 transition duration-200 bg-[#ff4d2d]
                     text-white hover:bg-[#e64323] cursor-pointer`}  onClick={handleSignUp}  disabled=  {loading} >
               {loading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
                        </button>




{/* // Error */}
{err && (
  <p className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-semibold mt-3">
    <span>⚠️</span>
    <span>{err}</span>
  </p>
)}

                <button className='w-full mt-5 flex items-center  justify-center gap-2 border
    rounded-lg px-4 py-2  tarnsition duration-200  border-gray-400 hover:bg-gray-300
    
    ' onClick={handleGoogleAuth}><FcGoogle size={20}  />
                    <span>Sign Up with Google</span>

                </button>
                <p 
                  
                onClick={
                ()=>navigate("/signin")}
                
             className=   '    cursor-pointer    text-center  mt-5'>Already have an account ? <span className='text-[#ff4d2d]'><b>Sign In</b></span></p>
            </div>



        </div>


    )
}

export default SignUp