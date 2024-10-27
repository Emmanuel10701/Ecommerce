// components/Footer.tsx
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import icons from react-icons

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full sm:w-1/3 mb-6">
            <h4 className="text-lg font-bold mb-3">About Us</h4>
            <p className="text-gray-400">
              <span>We are a leading e-commerce platform offering a wide range of products to suit your needs. </span>
              <span>Our mission is to provide the best shopping experience possible.</span>
            </p>
          </div>

          <div className="w-full sm:w-1/3 mb-6">
            <h4 className="text-lg font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400 hover:text-white cursor-pointer"><span>Home</span></span></li>
              <li><span className="text-gray-400 hover:text-white cursor-pointer"><span>Shop</span></span></li>
              <li><span className="text-gray-400 hover:text-white cursor-pointer"><span>About</span></span></li>
              <li><span className="text-gray-400 hover:text-white cursor-pointer"><span>Contact</span></span></li>
            </ul>
          </div>

          <div className="w-full sm:w-1/3 mb-6">
            <h4 className="text-lg font-bold mb-3">Connect With Us</h4>
            <div className="flex space-x-4">
              <span className="text-gray-400 hover:text-white cursor-pointer" aria-label="Facebook"><FaFacebook size={24} /></span>
              <span className="text-gray-400 hover:text-white cursor-pointer" aria-label="Twitter"><FaTwitter size={24} /></span>
              <span className="text-gray-400 hover:text-white cursor-pointer" aria-label="Instagram"><FaInstagram size={24} /></span>
              <span className="text-gray-400 hover:text-white cursor-pointer" aria-label="LinkedIn"><FaLinkedin size={24} /></span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm">
            <span>&copy; {new Date().getFullYear()} E-Commerce Store. </span>
            <span>All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
