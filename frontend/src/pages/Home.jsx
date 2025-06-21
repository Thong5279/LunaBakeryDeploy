import React, { use } from "react";
import Hero from "../components/Layout/hero";
import CategorySection from "../components/Products/CategorySection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCakes from "../components/Products/FeaturedCakes";
import FeaturedColection from "../components/Products/featuredCollection";
import { useDispatch } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellers, setBestSellers] = useState(null);

  useEffect(() => {
    //Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        // gender: "unisex",
        category: "cakes",
        limit: 8,
      })
    );
    //fetch best sellers products
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-sellers`
        );
        console.log("Best Sellers:", response.data);
        setBestSellers(response.data);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      }
    };
    fetchBestSellers();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <CategorySection />
      <NewArrivals />
      {/* Best sellers */}
      <h2 className="text-3xl text-center font-bold text-pink-500 mb-4 tracking-wide">
        ✨ Best Sellers ✨
      </h2>
      {bestSellers?._id ? (
        <ProductDetails productId={bestSellers._id} />
      ) : (
        <p>Đang tải sản phẩm bán chạy nhất ...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4 text-pink-600">
          Bánh Ngọt Được Ưa Chuộng Nhất 🍰
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCakes />
      <FeaturedColection />
    </div>
  );
};

export default Home;
