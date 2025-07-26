import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clcake1 from "../../assets/colecttioncake/clcake1.jpg";
import clcake2 from "../../assets/colecttioncake/clcake2.jpg";
import clcake3 from "../../assets/colecttioncake/clcake3.jpg";
import clcake4 from "../../assets/colecttioncake/clcake4.jpg";
import baking1 from "../../assets/ingredient/baking1.jpg";
import baking2 from "../../assets/ingredient/baking2.jpg";
import baking3 from "../../assets/ingredient/baking3.jpg";
import baking4 from "../../assets/ingredient/baking4.jpg";

const CategorySection = () => {
  const cakeImages = [clcake1, clcake2, clcake3, clcake4];
  const bakingImages = [baking1, baking2, baking3, baking4];

  const [cakeIndex, setCakeIndex] = useState(0);
  const [bakingIndex, setBakingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCakeIndex((prev) => (prev + 1) % cakeImages.length);
      setBakingIndex((prev) => (prev + 1) % bakingImages.length);
    }, 3000); // 3 giây đổi ảnh

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-0">
      <div className="container mx-auto">
        {/* Tiêu đề chính */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Khám phá danh mục sản phẩm
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2 sm:mt-4 px-2">
            Chúng tôi mang đến cho bạn những sản phẩm tốt nhất từ bánh ngọt đến
            nguyên liệu làm bánh.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
          {/* Collection Cake Category */}
          <Link
            to="/collections/all?cake"
            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md"
          >
            <img
              src={cakeImages[cakeIndex]}
              alt="Collection Cake Category"
              className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-cover transition-all duration-1000 group-hover:scale-110"
            />
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 bg-white/90 p-3 sm:p-4 rounded-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-pink-500 transition-colors duration-300">
                Bánh ngọt
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Khám phá những chiếc bánh tuyệt vời
              </p>
            </div>
          </Link>

          {/* Baking Category */}
          <Link
            to="/ingredients"
            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md"
          >
            <img
              src={bakingImages[bakingIndex]}
              alt="Baking Ingredients Category"
              className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-cover transition-all duration-1000 group-hover:scale-110"
            />
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-4 sm:left-6 lg:left-8 bg-white/90 p-3 sm:p-4 rounded-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-pink-500 transition-colors duration-300">
                Nguyên liệu làm bánh
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Nguyên liệu chất lượng cho chiếc bánh hoàn hảo
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
