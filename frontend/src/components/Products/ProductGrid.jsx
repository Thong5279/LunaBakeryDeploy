import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products ,loading, error }) => {
  // Hàm tính giá hiển thị cho sản phẩm
  const getDisplayPrice = (product) => {
    // Ưu tiên discountPrice nếu có
    if (product.discountPrice) {
      return product.discountPrice;
    }
    
    // Nếu có sizePricing, lấy giá thấp nhất
    if (product.sizePricing && product.sizePricing.length > 0) {
      const lowestPrice = Math.min(...product.sizePricing.map(sp => sp.discountPrice || sp.price));
      return lowestPrice;
    }
    
    // Fallback về giá gốc
    return product.price;
  };

  const getMinMaxPriceText = (product) => {
    if (product.sizePricing && product.sizePricing.length > 1) {
      const prices = product.sizePricing.map(sp => sp.discountPrice || sp.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice !== maxPrice) {
        return `${minPrice.toLocaleString("vi-VN")} - ${maxPrice.toLocaleString("vi-VN")} ₫`;
      }
    }
    
    return `${getDisplayPrice(product).toLocaleString("vi-VN")} ₫`;
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
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
        {products.map((product, index) => {
          // Safe image access with fallback
          const imageUrl = product.images && product.images.length > 0 && product.images[0]?.url 
            ? product.images[0].url 
            : "https://via.placeholder.com/500x500?text=No+Image";
          const imageAlt = product.images && product.images.length > 0 && product.images[0]?.altText 
            ? product.images[0].altText 
            : product.name;

          return (
            <Link key={index} to={`/product/${product._id}`} className="block w-full max-w-xs">
              <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group relative flex flex-col h-full border border-gray-100 hover:border-pink-300">
                {/* Badge ngừng bán */}
                {product.status === 'inactive' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                    Ngừng bán
                  </div>
                )}
                <div className={`w-full aspect-square mb-4 overflow-hidden rounded-xl ${product.status === 'inactive' ? 'opacity-60' : ''}`}>
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className={`text-base mb-2 font-semibold text-center truncate ${product.status === 'inactive' ? 'text-gray-500' : 'text-gray-900'}`} title={product.name}>
                  {product.name}
                </h3>
                <p className={`font-bold text-base text-center ${product.status === 'inactive' ? 'text-gray-400' : 'text-pink-500'}`}>
                  {getMinMaxPriceText(product)}
                </p>
                {product.sizePricing && product.sizePricing.length > 1 && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {product.sizes?.length} kích thước
                  </p>
                )}
                {product.status === 'inactive' && (
                  <p className="text-xs text-red-500 mt-1 font-medium text-center">
                    Sản phẩm tạm ngừng bán
                  </p>
                )}
              </div>
            </Link>
          );
        })}
        {/* Nếu ít hơn 3 sản phẩm, thêm ô trống để căn giữa */}
        {products.length > 0 && products.length < 3 && Array.from({length: 3 - products.length}).map((_, i) => (
          <div key={`empty-${i}`} className="hidden md:block"></div>
        ))}
      </div>
      {/* Nếu không có sản phẩm */}
      {products.length === 0 && (
        <div className="text-center text-gray-400 py-12 text-lg">Chưa có sản phẩm nào.</div>
      )}
    </div>
  );
};

export default ProductGrid;
