import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from '../Common/Rating';

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}/reviews`
                );
                setReviews(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Đã xảy ra lỗi khi tải đánh giá</div>;
    }

    if (!reviews.length) {
        return <div className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</div>;
    }

    // Tính rating trung bình
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    return (
        <div className="space-y-6">
            {/* Tổng quan đánh giá */}
            <div className="flex items-center gap-4 border-b pb-4">
                <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div>
                    <Rating value={averageRating} size="large" />
                    <div className="text-sm text-gray-500">{reviews.length} đánh giá</div>
                </div>
            </div>

            {/* Danh sách đánh giá */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.user?.name || 'Khách hàng'}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="mb-2">
                            <Rating value={review.rating} size="small" />
                        </div>
                        {review.comment && (
                            <p className="text-gray-700">{review.comment}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews; 