import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-6 bg-gray-100 p-8 text-center">
      {/* Logo */}
      <img src={assets.imagingo1} alt="Imagingo " className="w-36 h-auto" />

      {/* Copyright */}
      <p className="text-sm text-gray-600">
        © 2025 IMAGINGO — All rights reserved.
      </p>

      {/* Social Icons */}
      <div className="flex gap-4">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img
            src={assets.instagram_icon}
            alt="Instagram"
            className="w-10 h-10 hover:scale-110 transition-transform duration-200"
          />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img
            src={assets.facebook_icon}
            alt="Facebook"
            className="w-10 h-10 hover:scale-110 transition-transform duration-200"
          />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img
            src={assets.twitter_icon}
            alt="Twitter"
            className="w-10 h-10 hover:scale-110 transition-transform duration-200"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;