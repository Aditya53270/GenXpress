import React from 'react'
import {useNavigate } from 'react-router-dom';

const Generatebtn = () => {
  const navigate = useNavigate();
  return (
    <div 
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} className='pb-16 text-center'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'>see the magic</h1>
      <button  onClick={()=>navigate('/buy')} className='bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300'>subscription</button>
    </div>
  )
}

export default Generatebtn;
