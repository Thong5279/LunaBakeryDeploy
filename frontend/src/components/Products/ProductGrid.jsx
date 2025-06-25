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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {products.map((product, index) => {
        // Safe image access with fallback
        const imageUrl = product.images && product.images.length > 0 && product.images[0]?.url 
          ? product.images[0].url 
          : "https://via.placeholder.com/500x500?text=No+Image";
        
        const imageAlt = product.images && product.images.length > 0 && product.images[0]?.altText 
          ? product.images[0].altText 
          : product.name;

        return (
          <Link key={index} to={`/product/${product._id}`} className="block">
            <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <div className="w-full h-96 mb-4">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-sm mb-2 font-medium">
                  {product.name.length > 25
                      ? `${product.name.slice(0, 25)}...`
                      : product.name}
              </h3>
             <p className="text-pink-500 font-bold text-sm">
               {getMinMaxPriceText(product)}
             </p>
             {product.sizePricing && product.sizePricing.length > 1 && (
               <p className="text-xs text-gray-500 mt-1">
                 {product.sizes?.length} kích thước
               </p>
             )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
