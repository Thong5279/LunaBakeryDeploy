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
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-96 mb-4">
              <img
                src={product.images[0].url}
                alt={product.images[0].alText || product.name}
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
      ))}
    </div>
  );
};

export default ProductGrid;
