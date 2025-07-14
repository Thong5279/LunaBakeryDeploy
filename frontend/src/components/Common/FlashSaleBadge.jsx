import React from 'react';
import { FaFire } from 'react-icons/fa';
import { useProductFlashSalePrice, useIngredientFlashSalePrice } from '../../utils/flashSaleUtils';

// Component cho sản phẩm
const ProductFlashSaleBadge = ({ item }) => {
  const flashSaleInfo = useProductFlashSalePrice(item);
  
  if (!flashSaleInfo.isFlashSale) {
    return null;
  }

  return (
    <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1 animate-pulse">
      <FaFire className="text-xs" />
      -{flashSaleInfo.discountPercent}%
    </div>
  );
};

// Component cho nguyên liệu
const IngredientFlashSaleBadge = ({ item }) => {
  const flashSaleInfo = useIngredientFlashSalePrice(item);
  
  if (!flashSaleInfo.isFlashSale) {
    return null;
  }

  return (
    <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1 animate-pulse">
      <FaFire className="text-xs" />
      -{flashSaleInfo.discountPercent}%
    </div>
  );
};

// Component chính
const FlashSaleBadge = ({ item, type = 'product' }) => {
  if (type === 'product') {
    return <ProductFlashSaleBadge item={item} />;
  } else {
    return <IngredientFlashSaleBadge item={item} />;
  }
};

export default FlashSaleBadge; 