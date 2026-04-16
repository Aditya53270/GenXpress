import React, { useContext } from 'react';
import { Routes,Route } from 'react-router-dom';
 import {ToastContainer} from 'react-toastify' ;
 import 'react-toastify/dist/ReactToastify.css';
 
import Homepage from './pages/Homepage';
import Buycredit from './pages/Buycredit';
import Result from './pages/Result'; // ✅ Added
import TextStudio from './pages/TextStudio';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import { AppContext } from './context/AppContext';



const App=()=>{
  const {showLogin}=useContext(AppContext)

   
 return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-slate-50 via-white to-zinc-100 text-zinc-900'>
      <ToastContainer position='bottom-right'/>
      <Navbar/> 
      {showLogin&&<Login/>}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/buycredit" element={<Buycredit />} />
        <Route path="/result" element={<Result />} /> {/* ✅ Route added */}
        <Route path="/text-studio" element={<TextStudio />} />
      </Routes>
      </div>
    
  );
}

export default App;
