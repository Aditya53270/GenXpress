import React from 'react'
import { delay,motion } from 'motion/react'
import sample_img_2 from '../assets/sample_img_2.png';

const Description = () => {
  return (
    <motion.div
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className='flex flex-col items-center justify-center text-center my-24 p-6 md:px-28'
    >
      <h1 className='text-3xl sm:text-4xl'>generate AI image</h1>
      <p>Turn Words into Wonders.</p>
<div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center justify-center mt-10'>
  <img src={sample_img_2} className='w-80 xl:w-96 rounded-lg' />
  <div>
    <h2 className='text-3xl font-medium max-w-lg mb-4'>intoducing AI website</h2>
    <p >Unleash your imagination with our AI-powered image generator. Just type a prompt, and watch your ideas transform into stunning visuals — instantly. Whether you're a designer, developer, or dreamer, it's never been easier to create art from thought.</p>
  </div>
</div>

    </motion.div>
  )
}

export default Description;
