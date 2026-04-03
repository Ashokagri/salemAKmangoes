import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, ShieldCheck, HeartPulse } from "lucide-react";
import "../componentStyles/Footer.css";
import Logo from "./Logo";
import FooterTop from "./FooterTop";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-custom">
        <FooterTop />
        
        <div className="footer-container">
          {/* Brand Section */}
          <div className="footer-section">
            <Logo />
            <p className="footer-description">
              Known for our organic and exceptionally sweet mangoes. 
              We've dedicated decades to providing premium, naturally grown 
              fruits directly from our orchards to your home.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="social-link-item hover:text-[#99cc33] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="social-link-item hover:text-[#99cc33] transition-colors"><Youtube size={20} /></a>
              <a href="#" className="social-link-item hover:text-[#99cc33] transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="social-links">
              <Link to="/products" className="social-link-item">Our Products</Link>
              <Link to="/about-us" className="social-link-item">About Our Journey</Link>
              <Link to="/contact-us" className="social-link-item">Contact Us</Link>
            </div>
          </div>

          {/* Policy Section */}
          <div className="footer-section">
            <h3>Policies</h3>
            <div className="social-links">
              <Link to="/contact-us" className="social-link-item"><ShieldCheck size={16} /> Terms & Conditions</Link>
              <Link to="/contact-us" className="social-link-item"><ShieldCheck size={16} /> Privacy Policy</Link>
              <Link to="/contact-us" className="social-link-item"><HeartPulse size={16} /> Refund Policy</Link>
              <Link to="/contact-us" className="social-link-item"><MapPin size={16} /> Shipping Policy</Link>
            </div>
          </div>
        </div>

        {/* Location Map Section (Desktop Grid Context or Full Width) */}
        <div className="footer-container py-4">
           {/* If you want map on the side in desktop, include it in the grid above */}
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} salemAKmangoes. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <span className="text-xs text-gray-500 uppercase tracking-widest">Premium Quality</span>
             <span className="text-xs text-gray-500 uppercase tracking-widest">100% Organic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
