// pages/404.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound: React.FC = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/");
  };

  const handleNavigation2 = () => {
    router.push("/contact");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="text-6xl font-bold text-indigo-600">404</div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl">Oops! Page not found</h1>
        <p className="mt-6 text-lg text-gray-600">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <div className="mt-10 flex justify-center gap-x-4">
          <button
            onClick={handleNavigation}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            aria-label="Go to Home Page"
          >
            Go Home
          </button>
          <button
            onClick={handleNavigation2}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            aria-label="Contact Support"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
