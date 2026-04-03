import React from 'react';
import banner_1 from "../Images/banner_1.png";
import "../componentStyles/Homebanner.css";
import { ShoppingCart, Leaf } from 'lucide-react';

const Homebanner = () => {
  return (
    <section className="banner-wrapper">
      <div className="banner-left">
        <div className="flex items-center gap-2 text-sm font-bold text-[#99cc33] uppercase tracking-wider mb-2">
          <Leaf size={16} /> 100% Organic & Naturally Ripened
        </div>
        <h1 className="banner-title">
          Our Best Mangoes, <br />
          Now <span>One Click Away</span>
        </h1>
        <p className="banner-subtitle">
          Experience the authentic taste of Salem's finest mangoes, handpicked from our 
          orchards and delivered peak-fresh to your doorstep.
        </p>

        <a href="/products" className="banner-btn group">
          <ShoppingCart size={20} className="transition-transform group-hover:scale-110" /> 
          Shop Collection
        </a>
      </div>

      <div className="banner-right">
        <img src={banner_1} alt="Premium Salem Mangoes" className="banner-image" />
      </div>
    </section>
  );
};

export default Homebanner;
