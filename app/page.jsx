// components/HomePage.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Image data array with text
const images = [
  { src: '/assets/c4.webp', text: "Black Friday Deals" },
  { src: '/assets/ecomerce.jpg', text: "E-commerce Deals" },
  { src: '/assets/dania.jpg', text: "Modern Products" },
  { src: '/assets/c3.jpg', text: "Get 80% Offer" },
];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState('');

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);



  const faqs = [
    { question: "🤔 What is your return policy?", answer: "We offer a 30-day return policy on all products. If you're not satisfied with your purchase, please contact us to arrange a return or exchange." },
    { question: "🌍 Do you offer international shipping?", answer: "Yes, we offer international shipping to many countries. Please check our shipping policy for more details." },
    { question: "📦 How can I track my order?", answer: "Once your order has shipped, you'll receive a tracking number via email. You can use this number to track your order on our website or the carrier's site." },
    { question: "💳 What payment methods do you accept?", answer: "We accept various payment methods including credit/debit cards, PayPal, and other secure payment gateways." },
  ];

  const handleSubscribe = async () => {
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
  
    // Set loading state to true before the API call
    setLoading(true);
  
    try {
      // Attempt to subscribe
      await axios.post('/api/subs', { email });
      toast.success('Subscription successful!');
      setEmail(''); // Clear the email input field
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      // Always reset loading state after API call
      setLoading(false);
    }
  };
  
  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/Productslistpage';
    }, 1000);
  };

  return (
    <div className="md:flex flex-col min-h-screen mt-24">
      {/* Image Slider */}
      <div className='md:flex items-center flex-col-reverse gap-1'>
        <div className='md:w-1/3 w-full flex-1'>
          <section className="py-6 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-6 text-center text-slate-500">Categories</h2>
              <ul className="list-none text-center space-y-4">
                <li className="text-xl font-semibold text-slate-500">Electronics</li>
                <li className="text-xl font-semibold text-slate-500">Home Appliances</li>
                <li className="text-xl font-semibold text-slate-500">Fashion</li>
                <li className="text-xl font-semibold text-slate-500">Books & Media</li>
              </ul>
            </div>
          </section>
        </div>
        <div className="relative w-full md:w-4/5 h-[60vh] md:h-[53vh] lg:h-[56vh] mb-10 -mr-1/3">
          <div
            className="relative w-full h-full group"
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={images[currentIndex].src}
              alt={`Slide ${currentIndex + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
            <div className="absolute inset-0 right-0 flex items-center justify-center text-white text-2xl md:text-3xl font-bold bg-black bg-opacity-40 rounded-xl p-4">
              {images[currentIndex].text}
            </div>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
              onClick={prevSlide}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
              onClick={nextSlide}
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-12 ${index === currentIndex ? "bg-green-400" : "bg-gray-300"} rounded-full transition-all duration-300`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-slate-500">
            Discover the Best Deals
          </h2>
          <p className="text-md text-gray-600 mb-8 text-center opacity-80">
            Explore a wide range of products at unbeatable prices. From the latest tech gadgets to stylish home decor, we have everything you need. Enjoy exclusive offers and discounts on your favorite items.
          </p>
          <div className="text-center mb-12">
            {loading ? (
              <CircularProgress />
            ) : (
              <span
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
                onClick={handleClick}
              >
                Explore Our Products
              </span>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <section className="bg-gray-100 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-500">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold text-blue-600">500+</h3>
                <p className="text-gray-600 text-lg opacity-75">Products Available</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold text-blue-600">20,000+</h3>
                <p className="text-gray-600 text-lg opacity-75">Happy Customers Per Year</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold text-blue-600">1,000+</h3>
                <p className="text-gray-600 text-lg opacity-75">Successful Orders</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 bg-white flex items-center">
          <div className="max-w-6xl mx-auto px-4 flex-1 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-500">Why Choose Us?</h2>
            <div className="space-y-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-blue-600 text-white p-4 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM12 4a8 8 0 000 16 8 8 0 000-16z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-500">Quality Products</h3>
                  <p className="text-gray-600 text-lg opacity-80">We offer a curated selection of high-quality products that meet our rigorous standards.</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-green-600 text-white p-4 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4V4z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-500">Exceptional Service</h3>
                  <p className="text-gray-600 text-lg opacity-80">Our customer service team is here to help you with any questions or issues you may have.</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-red-600 text-white p-4 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m4-4H8"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-500">Fast Shipping</h3>
                  <p className="text-gray-600 text-lg opacity-80">Enjoy quick and reliable shipping to get your orders delivered on time.</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-yellow-600 text-white p-4 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2 2 2m0-6v6"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-500">Competitive Pricing</h3>
                  <p className="text-gray-600 text-lg opacity-80">Get the best value for your money with our competitive pricing and regular discounts.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-1 justify-center">
            <Image src="/assets/ecomerce.jpg" alt="image for customer" width={280} height={380} className="flex-1" />
          </div>
        </section>

        <section className="py-12 bg-gray-100 flex items-center">
  <div className="hidden md:flex flex-1 justify-center">
    <Image src="/assets/img1.webp" alt="image for customer" width={280} height={380} className="flex-1" />
  </div>

  <div className="max-w-6xl mb-3 flex-1 mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold mb-6 text-center text-slate-700">FAQ</h2>
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg mb-4 p-4">
          <h3 className="font-semibold text-slate-500">{faq.question}</h3>
          <p className="text-gray-600 opacity-75">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Subscription Form */}
        <section className="py-12 bg-blue-700 flex text-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Stay Updated with Our Newsletter
            </h2>
            <p className="text-lg text-slate-100 mb-6 opacity-80">
              Subscribe to our newsletter to receive the latest updates, exclusive offers, and more. Don't miss out on our exciting promotions!
            </p>
            <div className="flex gap-2 sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-4 w-2/3 ml-2 max-w-xs text-slate-600 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className={`${loading ? 'flex items-center justify-center' : ''} bg-white text-blue-700 px-6 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition cursor-pointer`}
                onClick={!loading ? handleSubscribe : undefined}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} style={{ marginRight: 8 }} />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </span>
            </div>
          </div>
        </section>
      </main>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
