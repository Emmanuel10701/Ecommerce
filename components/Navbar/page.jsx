"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CiMenuBurger } from "react-icons/ci"; 
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/page';

const LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Admin', href: '/productstable' },
];

const Navbar = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useRouter();
  const path = usePathname();

  const { state: cartState } = useCart();
  const items = cartState?.items || [];

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartNavigation = () => {
    setIsCartDropdownOpen(false);
    navigate.push("/Cartpage");
  };

  const toSetting = () => {
    navigate.push("/setting");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) setProfileImage(savedProfileImage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    onSearch(searchTerm);
    navigate.push('/search');
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 bg-slate-100 p-4 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          <h1 className='text-3xl font-bold text-slate-400 mx-4 sm:mx-10'>Shop</h1>
          <div className="hidden md:flex ml-4 md:ml-[30%] gap-8 items-center">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`${link.href === path ? 'text-zinc-600 font-bold text-md' : 'text-slate-500 text-sm hover:text-slate-600'}`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>        

        <div className="flex items-center space-x-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}>
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item bg-red-600 rounded-full text-white">{totalItems}</span>
              </div>
            </div>
            {isCartDropdownOpen && (
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold">{totalItems} Items</span>
                  <span className="text-info">Subtotal: ${totalPrice.toFixed(2)}</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block" onClick={cartNavigation}>View cart</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={40}
                    height={40}
                    onClick={toSetting}
                    className="w-10 h-10 object-cover rounded-full border-2 border-white cursor-pointer"
                  />
                ) : (
                  <UserCircleIcon className="w-10 h-10 text-white cursor-pointer" onClick={toSetting} />
                )}
              </div>
            </div>
          </div>
        </div>

        <button className="block md:hidden p-2" onClick={toggleMenu}>
          <CiMenuBurger className="text-3xl" />
        </button>
      </div>

      <div className={`fixed top-0 right-0 h-screen w-1/2 bg-slate-700 text-white transform ${isMenuOpen ? 'translate-x-0 z-50' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col items-start pt-16`} ref={menuRef}>
        <div className="absolute top-8 right-8">
          <button onClick={toggleMenu} className="text-white text-4xl z-10 flex items-center justify-center mb-8">
            &times;
          </button>
        </div>
        <div className="flex flex-col items-start ml-4 space-y-4">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => { toggleMenu(); }}>
              <span className={`block px-4 py-2 text-lg cursor-pointer ${link.href === path ? 'text-yellow-300 font-bold' : 'text-white hover:text-gray-300'}`}>
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
