import React from 'react';
import { testimonialsData } from '../assets/assets';
import rating_star from "../assets/rating_star.svg";
import { delay,motion } from 'motion/react';
const Testimonial = () => {
  return (
    < motion.div className='flex flex-col items-center justify_center my-20 p-12'
       initial={{opacity:0.2,y:100}}
       transition={{duration:1}}
       whileInView={{opacity:1,y:0}} 
       viewport={{once:true}}
       >
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>user reviews</h1>
      <p className='text-grey-500 mb-12'>what our customers say</p>
      <div className='flex flex-wrap gap-6'>
        {testimonialsData.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="testimonial-image"
            />
            <h2 className=" text-xl front_semibood mt-3" >{testimonial.name}</h2>
            <p className="text-gray-500 mb-4">{testimonial.role}</p>
            
              <div className='flex justify-center gap-1 text-sm text-gray-600'>
              {Array(testimonial.stars).fill().map((_, i) => (
                <img
                  key={i}
                  src={rating_star}
                  alt="star"
                  className="testimonial-star"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonial;