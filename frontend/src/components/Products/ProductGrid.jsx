import React from "react";
import { Link } from "react-router-dom";
import { FaTag, FaClock, FaWeight, FaStar, FaFire } from "react-icons/fa";
import { useProductFlashSalePrice, formatPrice } from "../../utils/flashSaleUtils";

// Component riêng cho từng product item
const ProductItem = ({ product, index }) => {
  const flashSalePrice = useProductFlashSalePrice(product);

  const formatDescription = (description) => {
    if (!description) return "";
    return description.length > 80 ? description.substring(0, 80) + "..." : description;
  };

  const getRatingDisplay = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        <FaStar className="text-yellow-400 text-xs" />
        <span className="text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Safe image access with fallback
  const imageUrl = product.images && product.images.length > 0 && product.images[0]?.url 
    ? product.images[0].url 
    : "https://via.placeholder.com/500x500?text=No+Image";
  const imageAlt = product.images && product.images.length > 0 && product.images[0]?.altText 
    ? product.images[0].altText 
    : product.name;

  // Tính giá hiển thị
  const getDisplayPrice = () => {
    if (flashSalePrice.isFlashSale) {
      return flashSalePrice.displayPrice;
    }
    if (product.discountPrice) {
      return product.discountPrice;
    }
    if (product.sizePricing && product.sizePricing.length > 0) {
      const lowestPrice = Math.min(...product.sizePricing.map(sp => sp.discountPrice || sp.price));
      return lowestPrice;
    }
    return product.price;
  };

  const getMinMaxPriceText = () => {
    if (flashSalePrice.isFlashSale) {
      return formatPrice(flashSalePrice.displayPrice);
    }
    if (product.sizePricing && product.sizePricing.length > 1) {
      const prices = product.sizePricing.map(sp => sp.discountPrice || sp.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice !== maxPrice) {
        return `${minPrice.toLocaleString("vi-VN")} - ${maxPrice.toLocaleString("vi-VN")} ₫`;
      }
    }
    return formatPrice(getDisplayPrice());
  };

  return (
    <Link to={`/product/${product._id}`} className="block w-full max-w-xs">
      <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group relative flex flex-col h-full border border-gray-100 hover:border-pink-300">
        {/* Badge ngừng bán */}
        {product.status === 'inactive' && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
            Ngừng bán
          </div>
        )}

        {/* Badge Flash Sale */}
        {flashSalePrice.isFlashSale ? (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1 animate-pulse">
            <FaFire className="text-xs" />
            -{flashSalePrice.discountPercent}%
          </div>
        ) : product.discountPrice && product.discountPrice < product.price ? (
          <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-1">
            <FaFire className="text-xs" />
            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </div>
        ) : null}

        {/* Ảnh sản phẩm */}
        <div className={`w-full aspect-square mb-4 overflow-hidden rounded-xl ${product.status === 'inactive' ? 'opacity-60' : ''}`}>
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Tên sản phẩm */}
        <h3 className={`text-base mb-2 font-semibold text-center line-clamp-2 ${product.status === 'inactive' ? 'text-gray-500' : 'text-gray-900'}`} title={product.name}>
          {product.name}
        </h3>

        {/* Mô tả ngắn */}
        {product.description && (
          <p className="text-xs text-gray-600 mb-3 text-center line-clamp-2">
            {formatDescription(product.description)}
          </p>
        )}

        {/* Thông tin chi tiết */}
        <div className="space-y-2 mb-3">
          {/* Danh mục và đánh giá */}
          <div className="flex items-center justify-center gap-3">
            {product.category && (
              <div className="flex items-center gap-1">
                <FaTag className="text-pink-400 text-xs" />
                <span className="text-xs text-gray-600">{product.category}</span>
              </div>
            )}
            {product.rating && getRatingDisplay(product.rating)}
          </div>

          {/* Thời gian làm */}
          {product.bakingTime && (
            <div className="flex items-center justify-center gap-1">
              <FaClock className="text-blue-400 text-xs" />
              <span className="text-xs text-gray-600">{product.bakingTime} phút</span>
            </div>
          )}

          {/* Trọng lượng */}
          {product.weight && (
            <div className="flex items-center justify-center gap-1">
              <FaWeight className="text-green-400 text-xs" />
              <span className="text-xs text-gray-600">{product.weight}g</span>
            </div>
          )}
        </div>

        {/* Giá */}
        <div className="mt-auto">
          {flashSalePrice.isFlashSale ? (
            <>
              <p className={`font-bold text-base text-center ${product.status === 'inactive' ? 'text-gray-400' : 'text-red-500'}`}>
                {formatPrice(flashSalePrice.displayPrice)}
              </p>
              <p className="text-xs text-gray-400 text-center line-through">
                {formatPrice(flashSalePrice.originalPrice)}
              </p>
              <p className="text-xs text-red-500 text-center font-medium">
                ⚡ Flash Sale
              </p>
            </>
          ) : (
            <>
              <p className={`font-bold text-base text-center ${product.status === 'inactive' ? 'text-gray-400' : 'text-pink-500'}`}>
                {getMinMaxPriceText()}
              </p>
              
              {/* Giá gốc nếu có giảm giá */}
              {product.discountPrice && product.discountPrice < product.price && (
                <p className="text-xs text-gray-400 text-center line-through">
                  {product.price.toLocaleString("vi-VN")} ₫
                </p>
              )}
            </>
          )}
        </div>

        {/* Thông tin bổ sung */}
        <div className="mt-3 space-y-1">
          {/* Thành phần chính */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {product.ingredients.slice(0, 3).map((ingredient, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {ingredient}
                </span>
              ))}
              {product.ingredients.length > 3 && (
                <span className="text-xs text-gray-500">+{product.ingredients.length - 3}</span>
              )}
            </div>
          )}

          {/* Thông tin dinh dưỡng */}
          {product.nutrition && (
            <div className="flex justify-center gap-3 text-xs text-gray-500">
              {product.nutrition.calories && (
                <span>{product.nutrition.calories} cal</span>
              )}
              {product.nutrition.protein && (
                <span>{product.nutrition.protein}g protein</span>
              )}
            </div>
          )}

          {/* Lưu ý dị ứng */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {product.allergens.slice(0, 2).map((allergen, idx) => (
                <span key={idx} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  {allergen}
                </span>
              ))}
              {product.allergens.length > 2 && (
                <span className="text-xs text-red-500">+{product.allergens.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Trạng thái sản phẩm */}
        {product.status === 'inactive' && (
          <p className="text-xs text-red-500 mt-2 font-medium text-center">
            Sản phẩm tạm ngừng bán
          </p>
        )}
      </div>
    </Link>
  );
};

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse">
            <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="w-full">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 place-items-stretch justify-items-center"
        style={{ minHeight: '200px' }}
      >
        {products.map((product, index) => (
          <ProductItem key={product._id} product={product} index={index} />
        ))}
        
        {/* Nếu ít hơn 3 sản phẩm, thêm ô trống để căn giữa */}
        {products.length > 0 && products.length < 3 && Array.from({length: 3 - products.length}).map((_, i) => (
          <div key={`empty-${i}`} className="hidden md:block"></div>
        ))}
      </div>
      
      {/* Nếu không có sản phẩm */}
      {products.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <div className="text-6xl mb-4">🍰</div>
          <div className="text-lg font-medium mb-2">Chưa có sản phẩm nào</div>
          <div className="text-sm">Hãy thử thay đổi bộ lọc hoặc quay lại sau</div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
