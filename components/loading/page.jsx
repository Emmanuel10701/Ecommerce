// components/SkeletonCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const skeletonVariants = {
  pulse: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

const SkeletonCard = () => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
      <motion.div
        className="bg-gray-200 h-40 rounded-md"
        variants={skeletonVariants}
        animate="pulse"
      ></motion.div>
      <div className="p-4">
        <motion.div
          className="bg-gray-200 h-6 w-3/4 mb-2 rounded"
          variants={skeletonVariants}
          animate="pulse"
        ></motion.div>
        <motion.div
          className="bg-gray-200 h-4 w-1/2 mb-2 rounded"
          variants={skeletonVariants}
          animate="pulse"
        ></motion.div>
        <motion.div
          className="bg-gray-200 h-4 w-full rounded"
          variants={skeletonVariants}
          animate="pulse"
        ></motion.div>
      </div>
    </div>
  );
};

export default SkeletonCard;
