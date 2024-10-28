// StarRating.tsx
import React from 'react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="text-yellow-500 text-3xl">★</span>); // filled star
    } else {
      stars.push(<span key={i} className="text-gray-400 text-3xl">☆</span>); // empty star
    }
  }

  return <div className="flex">{stars}</div>;
};

export default StarRating;
