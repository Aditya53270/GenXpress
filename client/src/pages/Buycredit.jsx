import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'motion/react'; // ✅ removed delay

const plans = [
  { id: 1, desc: 'Basic Plan', credits: 10 },
  { id: 2, desc: 'Standard Plan', credits: 25 },
  { id: 3, desc: 'Premium Plan', credits: 50 }
];

const Buycredit = () => {
  return (
    <motion.div className="min-h-[80vh] text-center pt-14 mb-10">
      <button className="border border-grey-400 px-10 py-2 rounded-full mb-6">Our Subscription</button>
      <h1 className="text-center text-3xl font-bold mb-6 sm:mb-10">Choose the Subscription</h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20">
        {plans.map((item, index) => (
          <div key={index} className="bg-pink-100 p-6 rounded-lg flex flex-col items-center gap-4 w-[300px]">
            <img src={assets.lock_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{item.desc}</p>
            <p className="text-sm">Credits: {item.credits}</p>
            <p className="mt-6"><span className="text-3xl">₹{item.id * 100}</span> / {item.credits} credits</p>
            <button className="w-full bg-blue-500 text-white mt-8 text-sm rounded-full py-2.5 hover:bg-blue-600 transition-all duration-300">
              Buy
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Buycredit;
