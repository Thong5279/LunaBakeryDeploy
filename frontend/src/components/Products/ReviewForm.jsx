import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, resetReviewState } from '../../redux/slices/reviewSlice';
import Rating from '../Common/Rating';
import { toast } from 'sonner';

const ReviewForm = ({ orderId, productId, productName, onReviewSubmitted }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { loading, error, success } = useSelector((state) => state.reviews);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating < 1) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }

        try {
            setIsSubmitting(true);
            await dispatch(createReview({ orderId, productId, rating, comment })).unwrap();
        } catch (err) {
            console.error('Lỗi khi gửi đánh giá:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (success) {
            toast.success('Đánh giá sản phẩm thành công');
            setComment('');
            setRating(5);
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
            dispatch(resetReviewState());
        }
        if (error) {
            toast.error(error);
            dispatch(resetReviewState());
        }
    }, [success, error, dispatch, onReviewSubmitted]);

    if (loading || isSubmitting) {
        return (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-semibold mb-3">Đánh giá sản phẩm: {productName}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đánh giá của bạn
                    </label>
                    <div className="flex items-center gap-4">
                        <Rating
                            value={rating}
                            size="large"
                            onClick={(value) => setRating(value)}
                            text={`(${rating} sao)`}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nhận xét (không bắt buộc)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows="3"
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${
                        (loading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {(loading || isSubmitting) ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm; 