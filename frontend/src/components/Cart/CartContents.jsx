import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddToCart = (productId, delta, quantity, size, flavor, maxQuantity) => {
    const newQuantity = quantity + delta;
    
    // Kiểm tra số lượng tối thiểu
    if (newQuantity < 1) {
      return;
    }

    // Kiểm tra số lượng tối đa
    if (newQuantity > maxQuantity) {
      toast.error(`Số lượng không thể vượt quá ${maxQuantity} sản phẩm`);
      return;
    }

    dispatch(
      updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        size,
        flavor,
        userId,
        guestId,
      })
    );
  };

  const handleRemoveFromCart = (productId, size, flavor) => {
    dispatch(
      removeFromCart({
        productId,
        size,
        flavor,
        userId,
        guestId,
      })
    );
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  // Hàm kiểm tra xem sản phẩm có phải là nguyên liệu không
  const isIngredient = (product) => {
    return product.category === 'ingredient' || product.type === 'ingredient';
  };

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {cart.products.map((product, index) => {
        const isIngredientProduct = isIngredient(product);
        
        return (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100"
          >
            {/* Hình ảnh sản phẩm */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-grow min-w-0 w-full sm:w-auto">
              <div className="flex justify-between items-start gap-2 w-full">
                <div className="flex-grow min-w-0">
                  <h3 className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg truncate leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Chỉ hiển thị size và flavor cho sản phẩm không phải nguyên liệu */}
                  {!isIngredientProduct && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                      {product.size && product.size !== "Mặc định" && (
                        <span className="text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                          Size: {product.size}
                        </span>
                      )}
                      {product.flavor && product.flavor !== "Mặc định" && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                          Vị: {product.flavor}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Chỉ hiển thị stock quantity cho nguyên liệu, không hiển thị cho sản phẩm bánh */}
                  {isIngredientProduct && product.stockQuantity !== undefined && (
                    <p className="text-xs text-gray-400 mt-1">
                      (Còn {product.stockQuantity} sản phẩm)
                    </p>
                  )}
                </div>
                
                <button
                  className="text-gray-400 hover:text-pink-500 transition-colors p-1 flex-shrink-0"
                  title="Xoá sản phẩm"
                  onClick={() =>
                    handleRemoveFromCart(
                      product.productId,
                      product.size,
                      product.flavor
                    )
                  }
                >
                  <RiDeleteBin6Line className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              {/* Số lượng và giá */}
              <div className="flex justify-between items-center mt-2 sm:mt-3 md:mt-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.flavor,
                        product.stockQuantity
                      )
                    }
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center border border-gray-200 rounded-full text-pink-500 hover:bg-pink-50 transition-colors text-xs sm:text-sm md:text-base"
                  >
                    -
                  </button>
                  <span className="w-6 sm:w-8 md:w-10 text-center font-medium text-gray-700 text-xs sm:text-sm md:text-base">
                    {product.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.flavor,
                        product.stockQuantity
                      )
                    }
                    disabled={product.quantity >= product.stockQuantity}
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center border border-gray-200 rounded-full transition-colors text-xs sm:text-sm md:text-base
                      ${product.quantity >= product.stockQuantity 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-pink-500 hover:bg-pink-50'}`}
                  >
                    +
                  </button>
                </div>
                <p className="text-sm sm:text-base md:text-lg font-semibold text-pink-500">
                  {product.price.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContents;
