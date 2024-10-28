// src/components/star/StarRating.js
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({
  rating,
  color = 'orange',
  backgroundColor = 'transparent',
  starBackgroundColor = 'rgba(255, 255, 0, 0.2)',
}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const isFullStar = rating >= i;
    const isHalfStar = rating >= i - 0.5 && rating < i;
    const starColor = isFullStar || isHalfStar ? color : 'transparent';
    const starBackground = isFullStar || isHalfStar ? starBackgroundColor : 'transparent';

    stars.push(
      <div
        key={i}
        style={{
          backgroundColor: starBackground,
          display: 'inline-block',
          padding: '2px',
          borderRadius: '50%',
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
