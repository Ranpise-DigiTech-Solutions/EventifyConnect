import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAz3fiOvA-Z3FfhaZ8GBXdUY74kLSYfa1Y",
    authDomain: "chatbot-5f9b6.firebaseapp.com" ,
    databaseURL: "https://chatbot-5f9b6-default-rtdb.firebaseio.com",
    projectId: "chatbot-5f9b6" ,
    storageBucket: "chatbot-5f9b6.appspot.com" ,
    messagingSenderId: "871505661890" ,
    appId: "1:871505661890:web:5035d3fb4d9cc3f357905b" ,
    measurementId: "G-3VRXVPHQ6D" 
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
