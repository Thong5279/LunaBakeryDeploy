import React from 'react';
import { useSelector } from 'react-redux';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const IngredientReviewSection = () => {
    const { reviews, loading, error } = useSelector((state) => state.reviews);

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500">
                    Chưa có đánh giá nào cho nguyên liệu này
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
                Đánh giá từ khách hàng ({reviews.length})
            </h3>
            
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex items-start space-x-4">
                            <img 
                                src={review.user?.avatar || 'https://via.placeholder.com/40'} 
                                alt={review.user?.name || 'Người dùng'}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/40';
                                }}
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">
                                        {review.user?.name || 'Người dùng ẩn danh'}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                                
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, index) => (
                                        <svg
                                            key={index}
                                            className={`w-5 h-5 ${
                                                index < review.rating 
                                                    ? 'text-yellow-400' 
                                                    : 'text-gray-300'
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {review.comment && (
                                    <p className="mt-3 text-gray-700">
                                        {review.comment}
                                    </p>
                                )}

                                {review.images && review.images.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {review.images.map((image, idx) => (
                                            <img
                                                key={idx}
                                                src={image.url}
                                                alt={image.altText || `Hình ảnh ${idx + 1}`}
                                                className="w-24 h-24 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/96';
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IngredientReviewSection; 