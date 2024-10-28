// src/components/star/StarRating.tsx
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

type StarRatingProps = {
  rating: number;
  color?: string; // Color of the stars
  backgroundColor?: string; // Background color of the rating section
  starBackgroundColor?: string; // Background color of individual stars
};

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  color = 'orange',
  backgroundColor = 'transparent',
  starBackgroundColor = 'rgba(255, 255, 0, 0.2)', // Light yellow background for stars
}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isFullStar = rating >= i;
    const isHalfStar = rating >= i - 0.5 && rating < i;
    const starColor = isFullStar || isHalfStar ? color : 'transparent'; // Color for full or half stars
    const starBackground = isFullStar || isHalfStar ? starBackgroundColor : 'transparent'; // Background color for stars

    stars.push(
      <div
        key={i}
        style={{
          backgroundColor: starBackground,
          display: 'inline-block',
          padding: '2px', // Small padding to show background
          borderRadius: '50%', // Round background
        }}
      >
        {isFullStar ? (
          <FaStar style={{ color }} />
        ) : isHalfStar ? (
          <FaStarHalfAlt style={{ color }} />
        ) : (
          <FaRegStar style={{ color }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor }} className="flex p-1 rounded-md">
      {stars}
    </div>
  );
};

export default StarRating;
