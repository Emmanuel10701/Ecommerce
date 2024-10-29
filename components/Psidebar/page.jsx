// src/components/sidebar/Sidebar.js
import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/page'; // Adjust the path if necessary
import { useRouter } from 'next/navigation';

const Sidebar = ({ onFilterChange, isOpen, setIsOpen }) => {
  const [filterState, setFilterState] = useState({
    price: '',
    categorys: {
      'Accessories': false,
      'Groceries': false,
      'Fashions': false,
      'Home Appliants': false,
      'Kids': false
    }
  });

  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(true); // Initialize as open
  const { state: cartState } = useCart();
  const router = useRouter();
  const sidebarRef = useRef(null);
  const cartDropdownRef = useRef(null);

  const totalItems = cartState?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cartState?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  useEffect(() => {
    if (isOpen && window.innerWidth < 855) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(cartState));
  }, [cartState]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartState');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Assuming setCartState is available to set the cart state
      // setCartState(parsedCart);
    }
  }, []);

  const handlePriceChange = (event) => {
    const { value } = event.target;
    setFilterState(prevState => {
      const newFilterState = { ...prevState, price: value };
      onFilterChange(newFilterState);
      if (window.innerWidth < 855) {
        setIsOpen(false); // Close sidebar for price filter
      }
      return newFilterState;
    });
  };

  const cartNavigation = () => {
    setIsCartDropdownOpen(false); // Optionally close the dropdown when navigating
    router.push("/Cartpage");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // Close sidebar when clicking outside
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setIsCartDropdownOpen(false); // Close cart dropdown when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-white z-10 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-[20vw] p-4 border-r-2 border-gray-300 rounded-sm`}
      style={{ minWidth: '300px', display: 'flex', flexDirection: 'column' }}
    >
      <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-600">
        <FaTimes size={24} />
      </button>

      <div className="flex flex-col flex-grow">
        <div className="space-y-4 mt-8">
          <h2 className="text-lg text-purple-800 font-semibold mb-2">Price Range</h2>
          <div className='space-y-2'>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="price"
                value="under-500"
                checked={filterState.price === 'under-500'}
                onChange={handlePriceChange}
                className="form-radio"
              />
              <span className="ml-2 font-semibold text-slate-400 text-md">Under KSH 500</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="price"
                value="500-1000"
                checked={filterState.price === '500-1000'}
                onChange={handlePriceChange}
                className="form-radio"
              />
              <span className="ml-2 font-semibold text-slate-400 text-md">KSH 500 - KSH 1000</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="price"
                value="1000-5000"
                checked={filterState.price === '1000-5000'}
                onChange={handlePriceChange}
                className="form-radio"
              />
              <span className="ml-2 font-semibold text-slate-400 text-md">KSH 1000 - KSH 5000</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="price"
                value="5000-10000"
                checked={filterState.price === '5000-10000'}
                onChange={handlePriceChange}
                className="form-radio"
              />
              <span className="ml-2 font-semibold text-slate-400 text-md">KSH 5000 - KSH 10000</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="price"
                value="10000-and-above"
                checked={filterState.price === '10000-and-above'}
                onChange={handlePriceChange}
                className="form-radio"
              />
              <span className="ml-2 font-semibold text-slate-400 text-md">KSH 10000 and above</span>
            </label>
          </div>
        </div>

       {/* Cart Dropdown Box */}
<div
  ref={cartDropdownRef}
  className={`card card-compact dropdown-content bg-base-100 mt-8 w-full max-w-sm shadow ${isCartDropdownOpen ? 'block' : ''}`}
>
  <div className="card-body mt-20 ">
    <h1 className='text-2xl text-purple-700 mb-2'>Your Cart</h1>
    <span className="text-lg font-bold text-blue-700">({totalItems} items)</span>
    <div>
    <span className="text-info">Subtotal: KSH {totalPrice.toFixed(2)}</span>

    </div>
    <div className="card-actions mt-4">
      <button
        className="btn rounded-full mt-10 bg-transparent border border-purple-700 text-purple-700 py-2 px-4 transition-all duration-300 ease-in-out hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        onClick={cartNavigation}
      >
        View Cart
      </button>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default Sidebar;
