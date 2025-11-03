import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import starIcon from '../assets/star_icon.svg';
const Header = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    navigate('/result'); // ✅ No undefined variable
  };
  const handleSubscriptionClick = () => {
    navigate('/buycredit'); // ✅ No undefined variable
  };

  

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center my-20"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Tag */}
      <motion.div
        className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border hover:scale-105 border-neutral-500 transition-all duration-700"
        initial={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.5, duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p>Best Transform your images with AI</p>
        <img src={starIcon} className="w-8 h-8" alt="star icon" />
      </motion.div>

      {/* Title */}
      <h1 className="text-4xl max-w-[300px] sm:text-6xl sm:max-w-[590px] mx-auto mt-10 text-center">
        Transform words into <span className="text-purple-600 font-bold">ARTS</span> in few clicks
      </h1>

      {/* Description */}
      <p className="text-center max-w-xl mx-auto mt-5">
        Our AI-powered generator transforms your words into high-quality visuals instantly. Whether you're a designer, developer, or just exploring, type a prompt and let your imagination become art.
      </p>

      {/* Generate Button */}
      <motion.div
        onClick={handleGenerateClick}
        className="sm:text-lg text-white bg-purple-400 w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full hover:bg-purple-500 transition-all duration-300"
      >
        Generate Image
      </motion.div>
    </motion.div>
  );
};

export default Header;
