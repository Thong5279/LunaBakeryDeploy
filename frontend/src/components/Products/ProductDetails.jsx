import React, { use, useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
const selectedProduct = {
  name: "Bánh tiramisu",
  price: 50000,
  originalPrice: 60000,
  description:
    "Bánh tiramisu truyền thống với lớp kem mascarpone mềm mịn và cà phê đậm đà.",
  images: [
    {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Bánh tiramisu 1",
    },
    {
      url: "https://picsum.photos/500/500?random=2",
      altText: "Bánh tiramisu 2",
    },
  ],
  sizes: [18, 20, 22],
  flavors: ["Truyền thống", "Socola", "Matcha"],
  fillings: ["Kem tươi", "Mứt dâu", "Hạt hạnh nhân"],
  // toppings: ["Trái cây tươi", "Chocolate chip", "Hạt điều"],
  // layers: [1, 2, 3],
  // eggless: false,
};

const similarProducts = [
    {
       _id: "1",
        name: "product 1",
        price: 50000,
        originalPrice: 60000,
        images: [
            {
                url: "https://picsum.photos/500/500?random=3",
            },],
    }
    , {
        _id: "2",
        name: "product 2",
        price: 70000,
        originalPrice: 80000,
        images: [
            {
                url: "https://picsum.photos/500/500?random=4",
            },],
    }, {
        _id: "3",
        name: "product 3",
        price: 90000,
        originalPrice: 100000,
        images: [
            {
                url: "https://picsum.photos/500/500?random=5",
            },],
    }, {
        _id: "4",
        name: "product 4",
        price: 110000,
        originalPrice: 120000,
        images: [
            {
                url: "https://picsum.photos/500/500?random=6",
            },],
    },
];
    const ProductDetails = () => {
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    } else if (action === "minus") {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedFlavor) {
      toast.error(
        "Vui lòng chọn kích thước và hương vị trước khi thêm vào giỏ hàng."
      );
      return;
    }
    setButtonDisabled(true);
    // Giả lập thêm vào giỏ hàng
    setTimeout(() => {
      toast.success("Đã thêm vào giỏ hàng!", {
        duration: 1000,
      });
      setButtonDisabled(false);
    }, 500);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                onClick={() => setMainImage(image.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url
                    ? "border-[#4b2995] shadow-lg"
                    : "border-gray-300 hover:border-[#4b2995]"
                }
                transition duration-200`}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="mb-4">
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
          {/* Mobile Thumbnail */}
          <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url
                    ? "border-[#4b2995] shadow-lg"
                    : "border-gray-300 hover:border-[#4b2995]"
                } transition duration-200`}
                style={{ flexShrink: 0, marginRight: "8px" }}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>
          <div className="md:w-1/2 md:ml-10 space-y-7">
            {/* Tên sản phẩm */}
            <h1 className="text-3xl font-extrabold text-pink-500">
              {selectedProduct.name}
            </h1>

            {/* Giá */}
            <div className="space-y-1">
              <p className="text-lg text-gray-400 line-through">
                {selectedProduct.originalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <p className="text-2xl font-semibold text-[#f472b6]">
                {selectedProduct.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>

            {/* Mô tả */}
            <p className="text-gray-600 leading-relaxed text-[16px]">
              {selectedProduct.description}
            </p>

            {/* Kích thước */}
            <div>
              <p className="text-[#f472b6] font-semibold mb-2">Kích thước:</p>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1 rounded-full bg-[#ffe4e6] text-[#db2777] font-medium hover:bg-[#fecdd3] transition shadow-sm ${
                      selectedSize === size
                        ? "border-2 border-[#6d28d9] shadow-lg"
                        : "border border-transparent"
                    }`}
                  >
                    {size} cm
                  </button>
                ))}
              </div>
            </div>

            {/* Hương vị */}
            <div>
              <p className="text-[#f472b6] font-semibold mb-2">Hương vị:</p>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => setSelectedFlavor(flavor)}
                    className={`px-4 py-1 rounded-full bg-[#ffe4e6] text-[#db2777] font-medium hover:bg-[#fecdd3] transition shadow-sm ${
                      selectedFlavor === flavor
                        ? "border-2 border-[#db2777] shadow-lg"
                        : "border border-transparent"
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div>
              <p className="text-[#f472b6] font-semibold mb-2">Số lượng:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] transition text-lg font-bold shadow"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] transition text-lg font-bold shadow"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: buttonDisabled ? 1 : 1.05 }}
      className={`relative flex items-center justify-center bg-pink-500 text-white px-6 py-3 rounded-full w-full font-semibold transition duration-300 shadow-md ${
        buttonDisabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-pink-600 hover:shadow-lg"
      }`}
      onClick={handleAddToCart}
      disabled={buttonDisabled}
    >
      {buttonDisabled ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Đang thêm...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <FaShoppingCart className="text-lg" />
          Thêm vào giỏ hàng
        </div>
      )}
    </motion.button>
          </div>
        </div>
        <div className="">
            <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-pink-500 mb-8">
              Khách hàng nói gì về chúng tôi
            </h2>
            <div className="grid md:grid-cols-3 gap-8 px-4">
              <div className="p-6 bg-purple-50 rounded-lg shadow">
                <p className="text-gray-700 italic">
                  “Bánh vừa đẹp vừa ngon, giao hàng đúng hẹn. Rất hài lòng!”
                </p>
                <p className="mt-4 font-semibold text-pink-500">
                  – Huỳnh Tuyên
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg shadow">
                <p className="text-gray-700 italic">
                  “Tôi đặt bánh sinh nhật cho con gái, ai cũng khen!”
                </p>
                <p className="mt-4 font-semibold text-pink-500">– Anh Khôi</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg shadow">
                <p className="text-gray-700 italic">
                  “Trang web dễ dùng, chọn bánh nhanh và nhiều tùy chọn.”
                </p>
                <p className="mt-4 font-semibold text-pink-500">– Minh Anh</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-100 text-pink-500 text-center py-4 rounded-lg mb-8 mt-4">
            🎁 Giảm 20% cho đơn đầu tiên – Dùng mã:{" "}
            <span className="font-semibold">L U N A</span>{" "}
            <span className="text-2xl">20</span>
          </div>
        </section>
        </div>
        {/* Sản phẩm gợi ý */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-semibold mb-6 text-pink-600">
            🌟 Bạn có thể thích 🌟
          </h2>
          <ProductGrid products={similarProducts}/>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
