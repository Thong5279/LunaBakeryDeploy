import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { FaTruck, FaBox, FaCheckCircle, FaClock, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import { getOrderReviews, getProductReviews } from '../redux/slices/reviewSlice';
import ReviewForm from '../components/Products/ReviewForm';
import Rating from '../components/Common/Rating';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [_socket, setSocket] = useState(null);
    const dispatch = useDispatch();
    const { orderDetails: order, loading } = useSelector((state) => state.orders);
    const { reviews } = useSelector((state) => state.reviews);

    // Format currency helper
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0₫';
        return amount.toLocaleString('vi-VN') + '₫';
    };

    useEffect(() => {
        // Kết nối socket
        const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            if (id) {
                newSocket.emit('joinOrderRoom', id);
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            // Thử kết nối lại sau 5 giây
            setTimeout(() => {
                newSocket.connect();
            }, 5000);
        });

        newSocket.on('orderStatusUpdated', (data) => {
            if (data.orderId === id) {
                dispatch(fetchOrderDetails(id));
            }
        });

        setSocket(newSocket);

        // Fetch dữ liệu đơn hàng và đánh giá
        if (id) {
            dispatch(fetchOrderDetails(id));
            dispatch(getOrderReviews(id));
        }

        return () => {
            if (newSocket) {
                if (id) {
                    newSocket.emit('leaveOrderRoom', id);
                }
                newSocket.disconnect();
            }
        };
    }, [dispatch, id]);

    // Kiểm tra xem sản phẩm đã được đánh giá chưa
    const isProductReviewed = (productId, itemType = 'Product') => {
        if (!reviews || !Array.isArray(reviews)) return false;
        
        return reviews.some(review => {
            if (!review) return false;
            
            // Kiểm tra theo product._id nếu có populate
            if (review.product && review.product._id) {
                return review.product._id === productId && review.itemType === itemType;
            }
            
            // Kiểm tra theo product (ObjectId string) nếu không có populate
            if (review.product) {
                return review.product.toString() === productId && review.itemType === itemType;
            }
            
            return false;
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'text-yellow-500';
            case 'approved':
                return 'text-blue-500';
            case 'baking':
                return 'text-orange-500';
            case 'ready':
                return 'text-green-500';
            case 'shipping':
                return 'text-purple-500';
            case 'delivered':
                return 'text-green-600';
            case 'cancelled':
                return 'text-red-500';
            case 'cannot_deliver':
                return 'text-red-600';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <FaClock className="w-6 h-6" />;
            case 'approved':
                return <FaCheckCircle className="w-6 h-6" />;
            case 'baking':
                return <FaBox className="w-6 h-6" />;
            case 'ready':
                return <FaBox className="w-6 h-6" />;
            case 'shipping':
                return <FaTruck className="w-6 h-6" />;
            case 'delivered':
                return <FaCheckCircle className="w-6 h-6" />;
            case 'cancelled':
                return <FaTimesCircle className="w-6 h-6" />;
            case 'cannot_deliver':
                return <FaTimesCircle className="w-6 h-6" />;
            default:
                return <FaClock className="w-6 h-6" />;
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'approved':
                return 'Đã duyệt';
            case 'baking':
                return 'Đang làm bánh';
            case 'ready':
                return 'Bánh đã sẵn sàng';
            case 'shipping':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            case 'cancelled':
                return 'Đã hủy';
            case 'cannot_deliver':
                return 'Không thể giao hàng';
            default:
                return 'Chờ xác nhận';
        }
    };

    const getStatusDescription = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'Đơn hàng của bạn đang chờ quản lý xác nhận';
            case 'approved':
                return 'Đơn hàng đã được duyệt và sẽ được chuyển cho nhân viên làm bánh';
            case 'baking':
                return 'Nhân viên đang làm bánh cho đơn hàng của bạn';
            case 'ready':
                return 'Bánh đã làm xong và sẽ được chuyển cho bộ phận giao hàng';
            case 'shipping':
                return 'Nhân viên giao hàng đang trên đường đến địa chỉ của bạn';
            case 'delivered':
                return 'Đơn hàng đã được giao thành công';
            case 'cancelled':
                return 'Đơn hàng đã bị hủy';
            case 'cannot_deliver':
                return 'Không thể giao hàng đến địa chỉ của bạn';
            default:
                return 'Đơn hàng đang được xử lý';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
    );

    if (!order) return null;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Back button */}
                <Link 
                    to="/my-orders" 
                    className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium mb-6"
                >
                    <FaArrowLeft className="mr-2" />
                    Quay lại danh sách đơn hàng
                </Link>

                {/* Order Header */}
                <div className="border-b pb-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Chi tiết đơn hàng #{order._id}
                    </h1>
                    <p className="text-gray-600">
                        Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                </div>

                {/* Order Status */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
                    <div className="flex items-start space-x-4">
                        <div className={`${getStatusColor(order.status)} p-3 rounded-full bg-opacity-10`}>
                            {getStatusIcon(order.status)}
                        </div>
                        <div>
                            <div className={`font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                {getStatusDescription(order.status)}
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                                Cập nhật: {new Date(order.updatedAt).toLocaleString('vi-VN')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Timeline */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Lịch sử trạng thái</h2>
                        <div className="space-y-4">
                            {order.statusHistory.map((history) => (
                                <div key={history._id || history.updatedAt.toString()} className="flex items-start space-x-4">
                                    <div className={`${getStatusColor(history.status)} mt-1`}>
                                        {getStatusIcon(history.status)}
                                    </div>
                                    <div>
                                        <div className="font-medium">{getStatusText(history.status)}</div>
                                        {history.note && (
                                            <div className="text-sm text-gray-600 mt-1">{history.note}</div>
                                        )}
                                        <div className="text-sm text-gray-500 mt-1">
                                            {new Date(history.updatedAt).toLocaleString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Order Details */}
                <div className="space-y-6">
                    {/* Shipping Info */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Thông tin giao hàng</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium">{order.shippingAddress?.name || 'Không có thông tin'}</p>
                            <p>{order.shippingAddress?.address || 'Không có địa chỉ'}</p>
                            <p>Điện thoại: {order.shippingAddress?.phonenumber || 'Không có số điện thoại'}</p>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Sản phẩm</h2>
                        <div className="space-y-4">
                            {order.orderItems?.map((item) => (
                                <div key={item.productId} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {item.size && `Size: ${item.size}`}
                                            {item.flavor && ` | Hương vị: ${item.flavor}`}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} x {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                    <div className="font-medium">
                                        {formatCurrency(item.quantity * item.price)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Thông tin thanh toán</h2>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                                <span>Tổng cộng:</span>
                                <span>{formatCurrency(order.totalPrice)}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                                Phương thức thanh toán: {order.paymentMethod || 'Không có thông tin'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {order && order.status === 'delivered' && (
                    <div className="mt-8 border-t pt-6">
                        <h2 className="text-2xl font-semibold mb-4">Đánh giá sản phẩm</h2>
                        <div className="space-y-4">
                            {order.orderItems?.map((item) => {
                                const itemType = item.itemType || 'Product';
                                const isReviewed = isProductReviewed(item.productId, itemType);
                                
                                // Luôn hiển thị ReviewForm, để nó tự quyết định hiển thị form hay thông báo đã đánh giá
                                return (
                                    <ReviewForm
                                        key={`${item.productId}-${itemType}`}
                                        orderId={id}
                                        productId={item.productId}
                                        productName={item.name}
                                        itemType={itemType}
                                        isAlreadyReviewed={isReviewed}
                                        onReviewSubmitted={() => {
                                            // Refresh đánh giá
                                            dispatch(getOrderReviews(id));
                                            dispatch(getProductReviews({ 
                                                productId: item.productId,
                                                itemType
                                            }));
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {/* Hiển thị các đánh giá đã gửi */}
                        {Array.isArray(reviews) && reviews.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4">Tóm tắt đánh giá của bạn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reviews.map((review) => (
                                        review && review.product && (
                                            <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium">{review.product.name}</span>
                                                    <span className="text-sm text-gray-500">
                                                        ({review.itemType === 'Product' ? 'Sản phẩm' : 'Nguyên liệu'})
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Rating value={review.rating} />
                                                    <span className="text-sm text-gray-600">({review.rating} sao)</span>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsPage;
