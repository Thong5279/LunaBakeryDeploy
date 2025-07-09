import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Rating from '../Common/Rating';

const TopRatedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopRatedProducts = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/top-rated`
                );
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTopRatedProducts();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">Đã xảy ra lỗi khi tải sản phẩm</div>;
    }

    if (!products.length) {
        return <div className="text-gray-500 text-center">Chưa có sản phẩm nào</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
                <Link 
                    key={product._id} 
                    to={`/products/${product._id}`}
                    className="group"
                >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-200 group-hover:shadow-md group-hover:-translate-y-1">
                        <div className="relative">
                            <img
                                src={product.images[0]?.url}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-full text-sm">
                                ⭐ {product.rating.toFixed(1)}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-1 truncate">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                                <Rating value={product.rating} size="small" />
                                <span className="text-sm text-gray-500">
                                    ({product.numReviews} đánh giá)
                                </span>
                            </div>
                            <div className="text-blue-600 font-medium">
                                {product.price.toLocaleString('vi-VN')}₫
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default TopRatedProducts; 