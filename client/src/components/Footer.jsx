import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-6 bg-white border border-zinc-200 rounded-2xl p-8 text-center mt-14 shadow-sm">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        <img
          src={assets.genxpressLogo}
          alt="GenXpress"
          className="w-14 h-14 object-cover rounded-full border border-zinc-300"
        />
        <div className="text-left">
          <p className="text-2xl font-extrabold tracking-tight text-zinc-900">GenXpress</p>
          <p className="text-xs text-zinc-500 -mt-1">AI Content Creation Platform</p>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-sm text-zinc-500">
        © 2025 GenXpress — All rights reserved.
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