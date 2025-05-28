import React from "react";
import Hero from "../components/Layout/hero";
import CategorySection from "../components/Products/CategorySection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";

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
    </div>
  );
};

export default Home;
