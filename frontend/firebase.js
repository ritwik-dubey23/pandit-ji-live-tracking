//GOOGLE                    AUTHENNTIICATIONNNNN
// 
// 
// 
// 
// 
// 
// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

    // for react    the  synatx to get the data of env fileee

    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,



    authDomain: "vingo-food-delivery-48cc9.firebaseapp.com",
    projectId: "vingo-food-delivery-48cc9",
    storageBucket: "vingo-food-delivery-48cc9.firebasestorage.app",
    messagingSenderId: "415409184408",
    appId: "1:415409184408:web:7b235e484b387fa2c6baed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
export { app, auth }