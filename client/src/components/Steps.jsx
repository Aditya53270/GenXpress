import React from 'react';
import { stepsData } from '../assets/assets';
import { motion } from 'motion/react';

const Steps = () => {
  return (
    <motion.div className="py-16 px-4 sm:px-8 max-w-6xl mx-auto text-center">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-purple-600">
        How AI Image Works
      </h1>
      <p className="text-gray-600 mb-12 text-lg">
        Transform texts into stunning images in just a few clicks.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stepsData.map((step, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img src={step.icon} alt={`Step ${index + 1}`} className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-purple-500 mb-2">{step.title}</h2>
            <p className="text-gray-500">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Steps;