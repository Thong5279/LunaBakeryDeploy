import React from 'react';
import { useProductFlashSalePrice, useIngredientFlashSalePrice, formatPrice } from '../../utils/flashSaleUtils';

// Component cho sản phẩm
const ProductFlashSalePrice = ({ item, className = '' }) => {
  const flashSaleInfo = useProductFlashSalePrice(item);
  
  if (flashSaleInfo.isFlashSale) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-600">
            {formatPrice(flashSaleInfo.displayPrice)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(flashSaleInfo.originalPrice)}
          </span>
        </div>
        <div className="text-xs text-red-500 font-medium mt-1">
          ⚡ Flash Sale
        </div>
      </div>
    );
  }

  // Không có flash sale, hiển thị giá thường
  if (item.discountPrice && item.discountPrice < item.price) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-pink-600">
            {formatPrice(item.discountPrice)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="font-bold text-gray-900">
        {formatPrice(item.discountPrice || item.price)}
      </span>
    </div>
  );
};

// Component cho nguyên liệu
const IngredientFlashSalePrice = ({ item, className = '' }) => {
  const flashSaleInfo = useIngredientFlashSalePrice(item);
  
  if (flashSaleInfo.isFlashSale) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-600">
            {formatPrice(flashSaleInfo.displayPrice)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(flashSaleInfo.originalPrice)}
          </span>
        </div>
        <div className="text-xs text-red-500 font-medium mt-1">
          ⚡ Flash Sale
        </div>
      </div>
    );
  }

  // Không có flash sale, hiển thị giá thường
  if (item.discountPrice && item.discountPrice < item.price) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-pink-600">
            {formatPrice(item.discountPrice)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="font-bold text-gray-900">
        {formatPrice(item.discountPrice || item.price)}
      </span>
    </div>
  );
};

// Component chính
const FlashSalePrice = ({ item, type = 'product', className = '' }) => {
  if (type === 'product') {
    return <ProductFlashSalePrice item={item} className={className} />;
  } else {
    return <IngredientFlashSalePrice item={item} className={className} />;
  }
};

export default FlashSalePrice; 