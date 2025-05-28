import React, { use, useEffect, useState } from "react";

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
const ProductDetails = () => {
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);
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
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
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
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
              />
            ))}
          </div>
          <div className="md:w-1/2 md:ml-10 space-y-7">
            {/* Tên sản phẩm */}
            <h1 className="text-3xl font-extrabold text-[#4b2995]">
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
              <p className="text-[#4b2995] font-semibold mb-2">Kích thước:</p>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-1 rounded-full bg-[#ede9fe] text-[#6d28d9] font-medium hover:bg-[#dcd4fc] transition shadow-sm"
                  >
                    {size} cm
                  </button>
                ))}
              </div>
            </div>

            {/* Hương vị */}
            <div>
              <p className="text-[#4b2995] font-semibold mb-2">Hương vị:</p>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    className="px-4 py-1 rounded-full bg-[#ffe4e6] text-[#db2777] font-medium hover:bg-[#fecdd3] transition shadow-sm"
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div>
              <p className="text-[#4b2995] font-semibold mb-2">Số lượng:</p>
              <div className="flex items-center gap-3">
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] transition text-lg font-bold shadow">
                  -
                </button>
                <span className="text-xl font-semibold text-gray-800">1</span>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] transition text-lg font-bold shadow">
                  +
                </button>
              </div>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <button className="bg-[#4b2995] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#3a2378] transition duration-300 shadow-md">
              <span>🛒</span> Thêm vào giỏ hàng
            </button>
          </div>
        </div>
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-purple-800 mb-8">
              Khách hàng nói gì về chúng tôi
            </h2>
            <div className="grid md:grid-cols-3 gap-8 px-4">
              <div className="p-6 bg-purple-50 rounded-lg shadow">
                <p className="text-gray-700 italic">
                  “Bánh vừa đẹp vừa ngon, giao hàng đúng hẹn. Rất hài lòng!”
                </p>
                <p className="mt-4 font-semibold text-purple-700">
                  – Linh Nguyễn
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg shadow">
                <p className="text-gray-700 italic">
                  “Tôi đặt bánh sinh nhật cho con gái, ai cũng khen!”
                </p>
                <p className="mt-4 font-semibold text-purple-700">
                  – Hạnh Trần
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg shadow">
                <p className="text-gray-700 italic">
                  “Trang web dễ dùng, chọn bánh nhanh và nhiều tùy chọn.”
                </p>
                <p className="mt-4 font-semibold text-purple-700">– Minh Anh</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-100 text-purple-800 text-center py-4 rounded-lg mb-8 mt-4">
            🎁 Giảm 20% cho đơn đầu tiên – Dùng mã:{" "}
            <span className="font-semibold">L U N A</span> <span className="text-2xl">20</span>  
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
