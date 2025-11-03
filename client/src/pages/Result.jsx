import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import sample_img_2 from '../assets/sample_img_2.png';

import { AppContext } from '../context/AppContext';

const Result = () => {
  const [image, setImage] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);

    // Call backend to generate image
    if(input){
    const image = await generateImage(input);
    if (image) {
      
      setIsImageLoaded(true);
      setImage(image);
    }
    }
    
    setLoading(false);
  };

  const resetHandler = () => {
    setIsImageLoaded(false);
    setImage(null);
    setInput('');
  };

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-24 p-6 md:px-28"
    >
      {/* Input Section (hidden when image is loaded) */}
      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-100 text-black text-sm p-0.5 mt-10 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe your vision"
            className="w-full px-4 py-3 rounded-l-full focus:outline-none"
          />
          <button
            type="submit"
            className="bg-purple-700 px-10 py-3 rounded-r-full text-white hover:bg-purple-800 transition"
          >
            Generate
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <p className="text-center mt-4 text-gray-600">Generating...</p>
      )}

      {/* Preview Image or Generated Image */}
      <div className="relative w-full max-w-xl mt-6">
        {!isImageLoaded ? (
          <img src={sample_img_2} alt="preview" className="w-full rounded-lg" />
        ) : (
          <img src={image} alt="Generated" className="w-full rounded-lg" />
        )}
        <span
          className={`absolute bottom-0 left-0 h-1 bg-purple-700 ${
            loading ? 'w-full transition-all duration-[10s]' : 'w-0'
          }`}
        ></span>
      </div>

      {/* Result Actions (shown when image is loaded) */}
      {isImageLoaded && (
        <div className="flex gap-4 flex-wrap justify-center text-sm mt-10">
          <button
            onClick={resetHandler}
            type="button"
            className="border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-zinc-100 transition"
          >
            Generate Another
          </button>
          <a
            href={image}
            download="generated.png"
            className="bg-yellow-900 text-white px-10 py-3 rounded-full cursor-pointer hover:bg-yellow-800 transition"
          >
            <img src="/download_icon.svg" alt="Download" className="inline-block mr-2" />
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;