import React, { useState, useEffect } from "react";
import Hero from "../components/Layout/hero";
import CategorySection from "../components/Products/CategorySection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import FeaturedCakes from "../components/Products/FeaturedCakes";
import FeaturedColection from "../components/Products/featuredCollection";
import QuickNavigation from "../components/Common/QuickNavigation";
import Chatbot from "../components/Common/Chatbot";
import FlashSaleBanner from "../components/Common/FlashSaleBanner";
import VoiceSearchBanner from "../components/Common/VoiceSearchBanner";
import { useDispatch } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";

const Home = () => {
    const dispatch = useDispatch();
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
        <div className="pb-16 lg:pb-0">
            {/* Hero Section */}
            <section id="hero">
                <Hero />
            </section>

            {/* Flash Sale Banner */}
            <section id="flash-sale">
                <FlashSaleBanner />
            </section>

            {/* Voice Search Banner */}
            <section className="py-4 px-4">
                <div className="container mx-auto">
                    <VoiceSearchBanner />
                </div>
            </section>

            {/* Thông báo thời gian làm và giao bánh */}
            <section className="py-4 px-4">
                <div className="container mx-auto">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                    ⏰ Thông tin giao hàng
                                </h4>
                                <p className="text-sm text-blue-700 leading-relaxed">
                                    Tất cả bánh được làm thủ công tươi ngon theo đơn đặt hàng. 
                                    <span className="font-medium">Thời gian tối thiểu 2 ngày</span> để làm và giao đến bạn. 
                                    Chúng tôi sẽ liên hệ để xác nhận thời gian giao hàng cụ thể.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
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
                        <h2 className="text-3xl font-bold text-pink-600 mb-6 flex items-center justify-center gap-2">
                            <img src="https://i.pinimg.com/originals/25/80/e2/2580e21fcf640ef972e85c088a7f97ca.gif" alt="Star" className="w-8 h-8" />
                            Sản Phẩm Nổi Bật
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

            {/* Featured Section */}
            <section id="featured">
                <FeaturedCakes />
                <FeaturedColection />
            </section>

            {/* Quick Navigation */}
            <QuickNavigation />

            {/* Chatbot */}
            <Chatbot />
        </div>
    );
};

export default Home;
