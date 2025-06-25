import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);
  
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    setTimeout(updateScrollButtons, 100);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [newArrivals]);

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

  return (
    <section>
      <div className="max-w-screen-xl mx-auto text-center mb-10 relative px-4">
        <h2 className="text-3xl font-bold mb-4 text-pink-600 tracking-wide">
          🌟 Các loại bánh mới !!
        </h2>
        <p className="text-gray-500 mb-8">
          Khám phá những loại bánh thơm ngon vừa ra mắt – chỉ dành riêng cho
          bạn!
        </p>

        {/* Nút scroll */}
        <div className="absolute right-4 top-[50%] transform -translate-y-1/2 hidden sm:flex space-x-2 z-10">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md border transition-all ${
              canScrollLeft
                ? "bg-white text-pink-500 hover:bg-pink-100"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md border transition-all ${
              canScrollRight
                ? "bg-white text-pink-500 hover:bg-pink-100"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Danh sách sản phẩm scroll ngang */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 px-4 scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {Array.isArray(newArrivals) && newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[80%] sm:min-w-[50%] lg:min-w-[30%] relative group rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <img
           src={product.images?.[0]?.url || "https://via.placeholder.com/500"}
           alt={product.images?.[0]?.altText || product.name}
              className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-5">
              <Link to={`/product/${product._id}`}>
                <h4 className="text-xl font-semibold group-hover:text-pink-400 transition duration-300">
                  {product.name}
                </h4>
                <p className="text-pink-500 font-bold text-sm">
                  {getDisplayPrice(product).toLocaleString("vi-VN")} ₫
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
