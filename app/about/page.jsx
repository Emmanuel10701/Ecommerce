"use client";
import React, { useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CiDeliveryTruck } from "react-icons/ci";
import { FaHeadset, FaMoneyCheckAlt } from "react-icons/fa";

const items = [
    { icon: <CiDeliveryTruck />, title: 'Free Delivery', description: 'We Offer Free delivery.' },
    { icon: <FaHeadset />, title: '24/7 Customer Support', description: 'We are here to help you.' },
    { icon: <FaMoneyCheckAlt />, title: 'Money Back Guarantee', description: 'Assured Money Back Guarantee.' },
];

const testimonials = [
  {
    text: "The team provided exceptional service and went above and beyond to meet our needs. We couldn’t be happier with the results!",
    author: "Sarah Lee",
    position: "Marketing Director",
    imgSrc: "/images/woman.avif"
  },
  {
    text: "The team provided exceptional service and went above and beyond to meet our needs. We couldn’t be happier with the results!",
    author: "Sarah Lee",
    position: "Marketing Director",
    imgSrc: "/images/men2.jpeg"
  },
  {
    text: "Their professionalism and expertise are unmatched. The project was completed on time and exceeded our expectations.",
    author: "Michael Brown",
    position: "CEO",
    imgSrc: "/images/women2.jpeg"
  },
  {
    text: "Their professionalism and expertise are unmatched. The project was completed on time and exceeded our expectations.",
    author: "Michael Brown",
    position: "CEO",
    imgSrc: "/images/men3.jpeg"
  },
  {
    text: "A fantastic team to work with. They understood our vision and delivered results that truly reflected our goals.",
    author: "Emily Davis",
    position: "Product Manager",
    imgSrc: "/images/women3.jpeg"
  }
];

const teamMembers = [
  {
    name: "Jane Doe",
    position: "CEO",
    imgSrc: "/images/men4.jpeg"
  },
  {
    name: "John Smith",
    position: "CTO",
    imgSrc: "/images/women4.jpeg"
  },
  {
    name: "Alice Johnson",
    position: "COO",
    imgSrc: "/images/men5.jpeg"
  }
];

const About = () => {
  const testimonialsRef = useRef(null);

  const scrollLeft = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 sm:px-6 mt-16 lg:px-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          About Us
        </h1>
        <p className="text-sm sm:text-md text-gray-400 mt-2">
          Discover more about our mission, values, and the team that makes it all happen.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row items-center w-full max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden p-4 sm:p-6">
        <div className="flex-1 flex items-center justify-center p-4">
          <Image
            src="/assets/about-us.png"
            alt="About Us"
            width={500}
            height={300}
            className="rounded-lg shadow-sm object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center p-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-4">Our Story</h2>
          <p className="text-sm sm:text-md text-gray-400">
            Founded in [Year], [Your Company Name] started with a vision to deliver high-quality products directly to you with ease and reliability. From a small venture in [Location], we’ve grown into a trusted name in eCommerce, committed to offering a curated selection of [product types] at competitive prices.
          </p>
        </div>
      </div>

      <section className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden mt-12 p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-slate-400">Our Mission</h2>
        <p className="text-gray-700 mb-6">
          We are dedicated to providing top-notch services to our clients. Our mission is to innovate and deliver solutions that meet the highest standards of quality and efficiency.
        </p>
        
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-400 mb-4">Our Values</h2>
        <ul className="list-disc list-inside text-slate-500 mb-6">
          <li>Integrity</li>
          <li>Customer Focus</li>
          <li>Innovation</li>
          <li>Collaboration</li>
        </ul>

        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-500 mb-6">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col border text-center text-slate-400 bg-slate-100 items-center p-4 rounded-lg">
              <Image
                src={member.imgSrc}
                alt={member.name}
                width={100}
                height={100}
                className="rounded-full bg-transparent object-cover mb-4"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-600">{member.position}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-white shadow-sm rounded-lg overflow-hidden mt-12 relative">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">What Our Clients Say</h2>
        <button
          onClick={scrollLeft}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 focus:outline-none"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 focus:outline-none"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
        <div
          ref={testimonialsRef}
          className="flex overflow-x-auto space-x-4 py-4 px-2 sm:px-4 scroll-smooth"
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex-shrink-0 w-72 sm:w-80 bg-white p-4 rounded-lg shadow-sm">
              <Image
                src={testimonial.imgSrc}
                alt={`Testimonial from ${testimonial.author}`}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
              <blockquote className="border-l-4 border-blue-500 pl-4">
                <p className="text-gray-700 italic">{testimonial.text}</p>
                <footer className="mt-2 text-gray-600">
                  — {testimonial.author}, <span className="font-semibold">{testimonial.position}</span>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-white shadow-sm rounded-lg overflow-hidden mt-12 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {items.map((item, index) => (
                <div key={index} className="flex flex-col items-center border-gray-200 p-4 bg-white rounded-lg shadow-sm text-center">
                    <div className="text-3xl text-green-400 mb-2">{item.icon}</div>
                    <h1 className="text-lg sm:text-xl text-slate-600 font-bold mb-2">{item.title}</h1>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default About;
