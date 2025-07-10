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

  return (
    <div className="space-y-4">
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          {/* Hình ảnh sản phẩm */}
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  size: <span className="text-pink-500">{product.size}</span> | 
                  vị: <span className="text-pink-500">{product.flavor}</span>
                </p>
                {/* Hiển thị số lượng tồn kho */}
                <p className="text-xs text-gray-400 mt-1">
                  (Còn {product.stockQuantity || 0} sản phẩm)
                </p>
              </div>
              <button
                className="text-gray-400 hover:text-pink-500 transition-colors"
                title="Xoá sản phẩm"
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.flavor
                  )
                }
              >
                <RiDeleteBin6Line className="h-5 w-5" />
              </button>
            </div>

            {/* Số lượng và giá */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
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
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full text-pink-500 hover:bg-pink-50 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-medium text-gray-700">
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
                  className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full transition-colors
                    ${product.quantity >= product.stockQuantity 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-pink-500 hover:bg-pink-50'}`}
                >
                  +
                </button>
              </div>
              <p className="text-lg font-semibold text-pink-500">
                {product.price.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
