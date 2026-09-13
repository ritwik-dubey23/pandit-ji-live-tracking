// import React from 'react'
// import { Routes, Route, Navigate } from "react-router-dom";
// import SignUp from './pages/SignUp'
// import SignIn from './pages/SignIn'
// import ForgotPassword from './pages/forgot-password'
// import useGetCurrUser from './hooks/useGetCurrUser.jsx';
// import Home   from   "./pages/Home.jsx"
// import { useSelector } from 'react-redux';
// import AddItem from './pages/Additem.jsx';

// import useGetCity from './hooks/useGetCity.jsx';
// import useGetMyShop from './hooks/useGetMyShop.jsx';
// import CreateEdit from './pages/CreateEditShop.jsx';
// import Edititem from './pages/Edititem.jsx';
// import useGetMyshop from './hooks/useGetMyShop.jsx';
// import UseGetItemsByCity from './hooks/UseGetItemsByCity.jsx';
// import Cartpage from './pages/Cartpage.jsx';
// import CheckOut from './pages/CheckOut.jsx';
// import MyOrder from './pages/MyOrder.jsx';
// import OrderPlaced from './pages/OrderPlaced.jsx';
// import useGetMyOrders from './hooks/useGetMyOrders.jsx';


// export const serverUrl="http://localhost:8000" 
 
 
// function App() { 
//   useGetCurrUser(); 
   
   
   
   
//   // shop ka SAB data dekhne ke liyye 
   
//   useGetMyshop(); 
   
   
   
   
   
   
//   //city user ki lane ke liye latitude and longitude 
//     useGetCity(); 
    
//     /// item lane ke liye according to the City
    
    
// UseGetItemsByCity();

    
//     // // City ke hisab se shop find krne ke liyye
//     // useGetMyshop();
    
    
    
    
//     useGetMyOrders();

//   const {userData}=useSelector(state=>state.user) 
                  
   
//   return ( 
//     <Routes> 
//      <Route path='/signup'  element={!userData?<SignUp/>:<Navigate  to={"/"}/>}/>  
      
//      <Route path='/signin'  element={!userData?<SignIn/>:<Navigate   to={"/"}/>}/>  
//        <Route path='/forgot-password'    element={!userData?<ForgotPassword/>:<Navigate   to={"/"}/>}/>  
// {/* home route */} 
//    <Route path='/'  element={userData?<Home/>:<Navigate  to={"/SignUp"}/>}/>  
      
 
 
 
//    <Route path='/create-edit-shop'  element={userData?<CreateEdit/>:<Navigate  to={"/SignUp"}/>}/>  

//    <Route path='/add-item'  element={userData?<AddItem/>:<Navigate  to={"/SignUp"}/>}/>  

   
//     <Route path='/edit-item/:itemId'  element={userData?<Edititem/>:<Navigate  to={"/SignUp"}/>}/>  



//     <Route path='/cart'  element={userData?<Cartpage/>:<Navigate  to={"/SignUp"}/>}/>  
//     <Route path='/checkOut'  element={userData?<CheckOut/>:<Navigate  to={"/SignUp"}/>}/>  
//     <Route path='/order-placed'  element={userData?<OrderPlaced/>:<Navigate  to={"/SignUp"}/>}/>  
//     <Route path='/my-orders'  element={userData?<MyOrder/>:<Navigate  to={"/SignUp"}/>}/>  

//     </Routes> 
    
//   ) 
// } 
 
// export default App









import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/forgot-password'
import useGetCurrUser from './hooks/useGetCurrUser.jsx';
import Home   from   "./pages/Home.jsx"
import { useSelector } from 'react-redux';
import AddItem from './pages/Additem.jsx';

import useGetCity from './hooks/useGetCity.jsx';
import useGetMyShop from './hooks/useGetMyShop.jsx';
import UseGetShopByCity from './hooks/UseGetShopByCity.jsx';
import CreateEdit from './pages/CreateEditShop.jsx';
import Edititem from './pages/Edititem.jsx';
import UseGetItemsByCity from './hooks/UseGetItemsByCity.jsx';
import Cartpage from './pages/Cartpage.jsx';
import CheckOut from './pages/CheckOut.jsx';
import MyOrder from './pages/MyOrder.jsx';
import OrderPlaced from './pages/OrderPlaced.jsx';
import useGetMyOrders from './hooks/useGetMyOrders.jsx';

import useUpdateLocation from './hooks/useUpdateLocation.jsx';
export const serverUrl="http://localhost:8000" 
 
 
function App() { 
  useGetCurrUser(); 
   
   
   
   
  // shop ka SAB data dekhne ke liyye (owner ka apna shop) 
       
  useGetMyShop(); 
   
   
   
   
   
   
  //city user ki lane ke liye latitude and longitude 
    useGetCity(); 
    
    /// item lane ke liye according to the City
    
    
UseGetItemsByCity();

    
    // City ke hisab se shop find krne ke liyye
    UseGetShopByCity();
    
    
    
    
    useGetMyOrders();

    useUpdateLocation(); // Update user location in the backend when it changes
  const {userData}=useSelector(state=>state.user) 
                  
   
  return ( 
    <Routes> 
     <Route path='/signup'  element={!userData?<SignUp/>:<Navigate  to={"/"}/>}/>  
      
     <Route path='/signin'  element={!userData?<SignIn/>:<Navigate   to={"/"}/>}/>  
       <Route path='/forgot-password'    element={!userData?<ForgotPassword/>:<Navigate   to={"/"}/>}/>  
{/* home route */} 
   <Route path='/'  element={userData?<Home/>:<Navigate  to={"/SignUp"}/>}/>  
      
 
 
 
   <Route path='/create-edit-shop'  element={userData?<CreateEdit/>:<Navigate  to={"/SignUp"}/>}/>  

   <Route path='/add-item'  element={userData?<AddItem/>:<Navigate  to={"/SignUp"}/>}/>  

   
    <Route path='/edit-item/:itemId'  element={userData?<Edititem/>:<Navigate  to={"/SignUp"}/>}/>  



    <Route path='/cart'  element={userData?<Cartpage/>:<Navigate  to={"/SignUp"}/>}/>  
    <Route path='/checkOut'  element={userData?<CheckOut/>:<Navigate  to={"/SignUp"}/>}/>  
    <Route path='/order-placed'  element={userData?<OrderPlaced/>:<Navigate  to={"/SignUp"}/>}/>  
    <Route path='/my-orders'  element={userData?<MyOrder/>:<Navigate  to={"/SignUp"}/>}/>  

    </Routes> 
    
  ) 
} 
 
export default App