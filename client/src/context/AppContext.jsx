// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({children}) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [credit, setCredit] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const navigate = useNavigate();

  const loadCreditsData=async()=>{
    try{
      console.log('Loading credits with token:', token)
      const{data}=await axios.get(backendUrl+'/api/user/credits',{headers:{Authorization: `Bearer ${token}`}})
      console.log('Credits response:', data)
      if(data.success){
        setCredit(data.credits)
        setUser(data.user)
      }
      
    }catch(error){
      console.log('Credits error:', error)
      toast.error(error.message)

    }
  }
  
   const generateImage=async(prompt)=>{
    try{
       const{data}=await axios.post(backendUrl+'/api/image/generate-image',
        {prompt},{headers: {token}}
      )
      if(data.success ){
        loadCreditsData()
        return data.resultImage
      }else{
        toast.error(data.message)
        loadCreditsData()
        if(data.creditBalance==0){
          navigate('/Buycredit')

        }
      }


    }catch(error){
      console.error('Error generating image:', error);
      toast.error(error.message);
      return null;
    }

  }
  const logout=()=>{
    localStorage.removeItem('token');
    setToken();
    setUser(null);
  }
  useEffect(()=>{
    if(token){
      loadCreditsData()
    }
  }, [token]);

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};