import React, { useState, useEffect, useRef } from 'react';

const PriceRangeSlider = ({ 
  minPrice = 0, 
  maxPrice = 1000000, 
  currentMin = 0, 
  currentMax = 1000000, 
  onChange 
}) => {
  const [values, setValues] = useState([currentMin, currentMax]);
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    setValues([currentMin, currentMax]);
  }, [currentMin, currentMax, minPrice, maxPrice]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getPercentage = (value) => {
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  };

  const getValueFromPercentage = (percentage) => {
    const value = (percentage / 100) * (maxPrice - minPrice) + minPrice;
    return Math.round(value / 1000) * 1000; // Round to nearest thousand
  };

  const handleMouseDown = (index, e) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = (e) => {
    if (isDragging === null || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newValue = Math.max(minPrice, Math.min(maxPrice, getValueFromPercentage(percentage)));

    const newValues = [...values];
    newValues[isDragging] = newValue;

    // Ensure min doesn't exceed max and vice versa
    if (isDragging === 0 && newValue <= values[1]) {
      newValues[0] = newValue;
    } else if (isDragging === 1 && newValue >= values[0]) {
      newValues[1] = newValue;
    }

    if (newValues[0] !== values[0] || newValues[1] !== values[1]) {
      setValues(newValues);
      onChange && onChange(newValues[0], newValues[1]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, values, minPrice, maxPrice]);

  const leftPercentage = getPercentage(values[0]);
  const rightPercentage = getPercentage(values[1]);

  return (
    <div className="px-2">
      {/* Current values display */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Từ</div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 text-sm font-medium text-pink-700">
            {formatPrice(values[0])} ₫
          </div>
        </div>
        <div className="text-gray-400 mx-2">-</div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Đến</div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 text-sm font-medium text-pink-700">
            {formatPrice(values[1])} ₫
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-6">
        {/* Track */}
        <div 
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        >
          {/* Active range */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"
            style={{
              left: `${leftPercentage}%`,
              width: `${rightPercentage - leftPercentage}%`
            }}
          />
          
          {/* Min handle */}
          <div 
            className={`absolute w-5 h-5 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab transform -translate-y-1/2 transition-transform hover:scale-110 ${
              isDragging === 0 ? 'scale-110 shadow-lg' : ''
            }`}
            style={{ 
              left: `${leftPercentage}%`,
              top: '50%',
              transform: `translateX(-50%) translateY(-50%)`,
            }}
            onMouseDown={(e) => handleMouseDown(0, e)}
          >
            <div className="absolute inset-1 bg-pink-500 rounded-full"></div>
          </div>
          
          {/* Max handle */}
          <div 
            className={`absolute w-5 h-5 bg-white border-2 border-pink-500 rounded-full shadow-md cursor-grab transform -translate-y-1/2 transition-transform hover:scale-110 ${
              isDragging === 1 ? 'scale-110 shadow-lg' : ''
            }`}
            style={{ 
              left: `${rightPercentage}%`,
              top: '50%',
              transform: `translateX(-50%) translateY(-50%)`,
            }}
            onMouseDown={(e) => handleMouseDown(1, e)}
          >
            <div className="absolute inset-1 bg-pink-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatPrice(minPrice)} ₫</span>
        <span>{formatPrice(maxPrice)} ₫</span>
      </div>

      {/* Quick preset buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            const newValues = [minPrice, 100000];
            setValues(newValues);
            onChange && onChange(newValues[0], newValues[1]);
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-md transition-colors"
        >
          Dưới 100k
        </button>
        <button
          onClick={() => {
            const newValues = [100000, 500000];
            setValues(newValues);
            onChange && onChange(newValues[0], newValues[1]);
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-md transition-colors"
        >
          100k - 500k
        </button>
        <button
          onClick={() => {
            const newValues = [500000, 1000000];
            setValues(newValues);
            onChange && onChange(newValues[0], newValues[1]);
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-md transition-colors"
        >
          500k - 1M
        </button>
        <button
          onClick={() => {
            const newValues = [1000000, maxPrice];
            setValues(newValues);
            onChange && onChange(newValues[0], newValues[1]);
          }}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-md transition-colors"
        >
          Trên 1M
        </button>
      </div>
    </div>
  );
};

export default PriceRangeSlider; 