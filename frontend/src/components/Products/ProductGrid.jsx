import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products ,loading, error }) => {
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
            <div className="bg-white p-4 rounded-lg">
              <div className="w-full h-96 mb-4">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-sm mb-2">
                  {product.name.length > 25
                      ? `${product.name.slice(0, 25)}...`
                      : product.name}
              </h3>
             <p className="text-gray-500 font-medium text-sm tracking-tighter">
               {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                   })}
             </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
