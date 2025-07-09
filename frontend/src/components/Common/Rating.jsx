import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = "#f8e825", size = "normal", onClick }) => {
    const stars = [1, 2, 3, 4, 5];
    
    const getStarIcon = (starValue) => {
        if (value >= starValue) {
            return <FaStar />;
        } else if (value >= starValue - 0.5) {
            return <FaStarHalfAlt />;
        } else {
            return <FaRegStar />;
        }
    };

    const getStarSize = () => {
        switch (size) {
            case 'small':
                return 'w-4 h-4';
            case 'large':
                return 'w-8 h-8';
            default:
                return 'w-6 h-6';
        }
    };

    return (
        <div className="flex items-center">
            {stars.map((star) => (
                <span
                    key={star}
                    style={{ color }}
                    className={`${getStarSize()} ${onClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onClick && onClick(star)}
                >
                    {getStarIcon(star)}
                </span>
            ))}
            {text && <span className="ml-1 text-sm">{text}</span>}
        </div>
    );
};

export default Rating; 