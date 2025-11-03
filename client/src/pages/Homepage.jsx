import React from 'react';
import Header from '../components/Header';
import Steps from '../components/Steps';
import Description from '../components/Description';
import Testimonial from '../components/Testimonial';
import Footer from '../components/Footer';
import Result from './Result'; // ✅ Make sure this file exists
import Buycredit from './Buycredit';

function Homepage() {
  return (
    <div>
      <Header />
      <Steps />
      <Description />
      <Testimonial />
      <Result /> {/* ✅ Only one image generation section */}
      <Footer />
      <Buycredit /> {/* ✅ Only one subscription section */}
      
    </div>
  );
}

export default Homepage;
