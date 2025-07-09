import React, { useState, useEffect } from "react";
import Hero from "../components/Layout/hero";
import CategorySection from "../components/Products/CategorySection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCakes from "../components/Products/FeaturedCakes";
import FeaturedColection from "../components/Products/featuredCollection";
import QuickNavigation from "../components/Common/QuickNavigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellers, setBestSellers] = useState(null);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'bestseller'

  useEffect(() => {
    //Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
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
    <div className="pb-16 lg:pb-0"> {/* Add bottom padding for mobile nav */}
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Categories Section */}
      <section id="categories">
        <CategorySection />
      </section>

      {/* New Arrivals & Best Sellers Combined Section */}
      <section id="new-arrivals" className="py-8 px-4">
        <div className="container mx-auto">
          {/* Tab Navigation */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-pink-600 mb-6">
              🌟 Sản Phẩm Nổi Bật
            </h2>
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-full p-1 inline-flex">
                <button
                  onClick={() => setActiveTab('new')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'new'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-pink-500'
                  }`}
                >
                  🎁 Bánh Mới
                </button>
                <button
                  onClick={() => setActiveTab('bestseller')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    activeTab === 'bestseller'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-pink-500'
                  }`}
                >
                  🔥 Bán Chạy
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-500">
            {activeTab === 'new' && <NewArrivals />}
            {activeTab === 'bestseller' && (
              <div id="best-sellers">
                {bestSellers?._id ? (
                  <ProductDetails productId={bestSellers._id} />
                ) : (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải sản phẩm bán chạy nhất...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl text-center font-bold mb-8 text-pink-600">
            Bánh Ngọt Được Ưa Chuộng Nhất 🍰
          </h2>
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured">
        <FeaturedCakes />
        <FeaturedColection />
      </section>

      {/* Quick Navigation */}
      <QuickNavigation />
    </div>
  );
};

export default Home;
