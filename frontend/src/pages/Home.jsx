import React from "react";
import Hero from "../components/Layout/hero";
import CategorySection from "../components/Products/CategorySection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCakes from "../components/Products/FeaturedCakes";

const placeholderProducts = [
  {
    _id: "5",
    name: "product 5",
    price: 50000,
    originalPrice: 60000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=9",
      },
    ],
  },
  {
    _id: "6",
    name: "product 6",
    price: 60000,
    originalPrice: 70000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=10",
      },
    ],
  },
  {
    _id: "7",
    name: "product 7",
    price: 70000,
    originalPrice: 80000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=11",
      },
    ],
  },
  {
    _id: "8",
    name: "product 8",
    price: 80000,
    originalPrice: 90000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=12",
      },
    ],
  },

  {
    _id: "9",
    name: "product 9",
    price: 90000,
    originalPrice: 100000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=13",
      },
    ],
  },
  {
    _id: "10",
    name: "product 10",
    price: 100000,
    originalPrice: 110000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=14",
      },
    ],
  },
  {
    _id: "11",
    name: "product 11",
    price: 110000,
    originalPrice: 120000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=15",
      },
    ],
  },
  {
    _id: "12",
    name: "product 12",
    price: 120000,
    originalPrice: 130000,
    images: [
      {
        url: "https://picsum.photos/500/500?random=16",
      },
    ],
  },
];

const Home = () => {
  return (
    <div>
      <Hero />
      <CategorySection />
      <NewArrivals />
      {/* Best sellers */}
      <h2 className="text-3xl text-center font-bold text-[#4b2995] mb-4 tracking-wide">
        ✨ Best Sellers ✨
      </h2>

      <ProductDetails />

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4 text-pink-600">
          Bánh Ngọt Được Ưa Chuộng Nhất 🍰
        </h2>
         <ProductGrid products={placeholderProducts} />
      </div>
     <FeaturedCakes />
    </div>
  );
};

export default Home;
