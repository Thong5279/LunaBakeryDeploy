import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  //Handle adding or substracting to cart
  const handleAddToCart = (productId, delta, quantity, size, flavor) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
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
    }
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
  };

  return (
    <div>
      {cart.products.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
          </div>
          <div>
            <h3 className="text-[#3c3c3c] font-semibold text-lg">
              {product.name}
            </h3>

            <p className="text-sm text-purple-400">
              size: {product.size}cm | vị: {product.flavor}
            </p>

            <div className="flex items-center mt-2">
              <button
                onClick={() =>
                  handleAddToCart(
                    product.productId,
                    -1,
                    product.quantity,
                    product.size,
                    product.flavor
                  )
                }
                className="border border-purple-300 text-purple-600 hover:bg-purple-100 transition px-2 py-1 rounded-md text-xl font-medium"
              >
                -
              </button>
              <span className="mx-4 text-gray-800 font-medium">
                {product.quantity}
              </span>
              <button 
              onClick={() =>
                handleAddToCart(
                  product.productId,
                  1,
                  product.quantity,
                  product.size,
                  product.flavor
                )
              }
              className="border border-purple-300 text-purple-600 hover:bg-purple-100 transition px-2 py-1 rounded-md text-xl font-medium">
                +
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-semibold text-pink-500">
                {product.price.toLocaleString("vi-VN")} ₫
              </p>
              <button
                className="text-[#814d81] hover:text-[#a37ba3] transition"
                title="Xoá sản phẩm"
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.flavor
                  )
                }
              >
                <RiDeleteBin6Line className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
