import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
const CartContents = () => {
  const cartProducts = [
    // Example products
    {
      productId: 1,
      name: "Bánh sinh nhật socola", //tên bánh
      size: 22, //kích thước bánh (đường kính)
      flavor: "Socola", //vị
      filling: "Kem tươi", //nhân bánh
      topping: "Trái cây tươi", //topping bánh
      layers: 1, //số tầng bánh
      eggless: false, //có trứng hay không
      message: "Happy Birthday Như!", //lời chúc
      price: 250000, //giá
      quantity: 1, //số lượng
      image: "https://picsum.photos/200?random=1", //hình ảnh bánh
    },
    {
      productId: 2,
      name: "Bánh sinh nhật trà xanh",
      size: 18,
      flavor: "Matcha",
      filling: "Nhân mứt dâu",
      topping: "Macaron",
      layers: 2,
      eggless: true,
      message: "Chúc mừng sinh nhật bé Gấu",
      price: 320000,
      quantity: 1,
      image: "https://picsum.photos/200?random=2",
    },
  ];
  return (
    <div>
      {cartProducts.map((product, index) => (
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
              <button className="border border-purple-300 text-purple-600 hover:bg-purple-100 transition px-2 py-1 rounded-md text-xl font-medium">
                -
              </button>
              <span className="mx-4 text-gray-800 font-medium">
                {product.quantity}
              </span>
              <button className="border border-purple-300 text-purple-600 hover:bg-purple-100 transition px-2 py-1 rounded-md text-xl font-medium">
                +
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">
                {product.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <button
                className="text-[#814d81] hover:text-[#a37ba3] transition"
                title="Xoá sản phẩm"
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
