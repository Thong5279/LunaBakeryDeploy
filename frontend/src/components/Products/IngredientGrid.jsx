import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import { useIngredientFlashSalePrice, formatPrice } from '../../utils/flashSaleUtils';

// Component riêng cho từng ingredient item
const IngredientItem = ({ ingredient }) => {
  const navigate = useNavigate();
  const flashSalePrice = useIngredientFlashSalePrice(ingredient);

  const formatQuantity = (quantity, unit) => {
    return `${quantity}`;
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Hết hàng
        </span>
      );
    } else if (quantity <= 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Sắp hết
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
          Còn hàng
        </span>
      );
    }
  };

  const handleIngredientClick = (ingredientId) => {
    navigate(`/ingredient/${ingredientId}`);
  };

  return (
    <div
      onClick={() => handleIngredientClick(ingredient._id)}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-pink-200 cursor-pointer transform hover:scale-105"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 h-48">
        {ingredient.images && ingredient.images.length > 0 ? (
          <img
            src={ingredient.images[0]}
            alt={ingredient.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
            <svg className="w-16 h-16 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        
        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {getStockStatus(ingredient.quantity)}
        </div>

        {/* Flash Sale Badge */}
        {flashSalePrice.isFlashSale && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1 animate-pulse">
            <FaFire className="text-xs" />
            -{flashSalePrice.discountPercent}%
          </div>
        )}

        {/* Hover overlay with "Xem chi tiết" button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleIngredientClick(ingredient._id);
            }}
            className="bg-white text-pink-600 px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-pink-50"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
            {ingredient.category}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
          {ingredient.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {ingredient.description}
        </p>

        {/* Quantity */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Số lượng:</span> {formatQuantity(ingredient.quantity)}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {flashSalePrice.isFlashSale ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(flashSalePrice.displayPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(flashSalePrice.originalPrice)}
                </span>
                <span className="text-xs text-red-500 font-medium">
                  ⚡ Flash Sale
                </span>
              </>
            ) : ingredient.discountPrice > 0 && ingredient.discountPrice < ingredient.price ? (
              <>
                <span className="text-lg font-bold text-pink-600">
                  {formatPrice(ingredient.discountPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(ingredient.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(ingredient.discountPrice || ingredient.price)}
              </span>
            )}
          </div>
          
          {/* Action icon */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IngredientGrid = ({ ingredients, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nguyên liệu</h3>
        <p className="text-gray-500">Thử thay đổi bộ lọc để xem thêm sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
      {ingredients.map((ingredient) => (
        <IngredientItem key={ingredient._id} ingredient={ingredient} />
      ))}
    </div>
  );
};

export default IngredientGrid; 