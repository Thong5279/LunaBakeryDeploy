import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaChartBar,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaBox,
  FaBoxOpen,
  FaUser,
  FaComment,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBan
} from "react-icons/fa";
import {
  fetchAdminReviews,
  updateReviewStatus,
  deleteReview,
  hideReview,
  showReview,
  fetchReviewStats,
  clearError,
  clearSuccessMessage,
  setFilters,
  resetFilters,
  setPage,
} from "../../redux/slices/adminReviewSlice";
import ConfirmModal from "../Common/ConfirmModal";
import Pagination from "../Common/Pagination";

const ReviewManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    reviews,
    pagination,
    stats,
    filters,
    loading,
    error,
    actionLoading,
    actionError,
    successMessage,
  } = useSelector((state) => state.adminReviews);

  // Local state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load reviews on component mount and when filters change
  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "manager")) {
      dispatch(fetchAdminReviews(filters));
      dispatch(fetchReviewStats('month'));
    }
  }, [dispatch, filters, user]);

  // Clear messages after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error || actionError) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, actionError, dispatch]);

  // Handlers
  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ page: 1 }));
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    dispatch(resetFilters());
    setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleDeleteReview = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      dispatch(deleteReview(reviewToDelete._id));
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleStatusChange = (reviewId, newStatus) => {
    dispatch(updateReviewStatus({ reviewId, status: newStatus }));
  };

  const handleHideReview = (reviewId) => {
    dispatch(hideReview(reviewId));
  };

  const handleShowReview = (reviewId) => {
    dispatch(showReview(reviewId));
  };

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'hidden':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'rejected':
        return <FaBan className="text-red-600" />;
      case 'hidden':
        return <FaEye className="text-gray-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const getItemTypeIcon = (itemType) => {
    return itemType === 'Product' ? <FaBox className="text-purple-500" /> : <FaBoxOpen className="text-blue-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } text-sm`}
      />
    ));
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Đang tải danh sách đánh giá...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaStar className="text-yellow-500" />
              Quản lý Đánh giá
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý tất cả đánh giá từ khách hàng
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <FaFilter />
              Lọc
            </button>
            <button
              onClick={clearAllFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <FaChartBar className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgRating ? stats.avgRating.toFixed(1) : '0.0'}
                </p>
              </div>
              <FaStar className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</p>
              </div>
              <FaClock className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedReviews}</p>
              </div>
              <FaCheckCircle className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã ẩn</p>
                <p className="text-2xl font-bold text-gray-600">{stats.hiddenReviews || 0}</p>
              </div>
              <FaEye className="text-gray-500 text-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại sản phẩm
              </label>
              <select
                value={filters.itemType}
                onChange={(e) => handleFilterChange('itemType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="Product">Sản phẩm</option>
                <option value="Ingredient">Nguyên liệu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
                <option value="hidden">Đã ẩn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Tất cả</option>
                <option value="1">1 sao</option>
                <option value="2">2 sao</option>
                <option value="3">3 sao</option>
                <option value="4">4 sao</option>
                <option value="5">5 sao</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="date-desc">Mới nhất</option>
                <option value="date-asc">Cũ nhất</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
                <option value="rating-asc">Đánh giá thấp nhất</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Tìm kiếm theo nội dung đánh giá..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      )}

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {actionError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {actionError}
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {review.user?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getItemTypeIcon(review.itemType)}
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">
                          {review.product?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.itemType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-900">
                        {review.rating}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {review.comment || 'Không có bình luận'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {getStatusIcon(review.status)}
                      <span className="ml-1">
                        {review.status === 'approved' && 'Đã duyệt'}
                        {review.status === 'pending' && 'Chờ duyệt'}
                        {review.status === 'rejected' && 'Từ chối'}
                        {review.status === 'hidden' && 'Đã ẩn'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(review)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(review._id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Duyệt"
                            disabled={actionLoading}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleStatusChange(review._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Từ chối"
                            disabled={actionLoading}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {review.status !== 'hidden' ? (
                        <button
                          onClick={() => handleHideReview(review._id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Ẩn đánh giá"
                          disabled={actionLoading}
                        >
                          <FaEye />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleShowReview(review._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Hiện lại đánh giá"
                          disabled={actionLoading}
                        >
                          <FaEye />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(review)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                        disabled={actionLoading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa đánh giá"
        message={`Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="red"
      />

      {/* Review Detail Modal */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết đánh giá</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedReview.user?.name}</h4>
                  <p className="text-sm text-gray-500">{selectedReview.user?.email}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  {getItemTypeIcon(selectedReview.itemType)}
                  <span className="font-medium text-gray-900">{selectedReview.product?.name}</span>
                  <span className="text-sm text-gray-500">({selectedReview.itemType})</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm text-gray-600">{selectedReview.rating}/5 sao</span>
                </div>

                {selectedReview.comment && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedReview.comment}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span>Ngày tạo: {formatDate(selectedReview.createdAt)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                    {selectedReview.status === 'approved' && 'Đã duyệt'}
                    {selectedReview.status === 'pending' && 'Chờ duyệt'}
                    {selectedReview.status === 'rejected' && 'Từ chối'}
                    {selectedReview.status === 'hidden' && 'Đã ẩn'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              {selectedReview.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReview._id, 'approved');
                      setShowDetailModal(false);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    disabled={actionLoading}
                  >
                    <FaCheck />
                    <span>Duyệt</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReview._id, 'rejected');
                      setShowDetailModal(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    disabled={actionLoading}
                  >
                    <FaTimes />
                    <span>Từ chối</span>
                  </button>
                </>
              )}
              {selectedReview.status !== 'hidden' ? (
                <button
                  onClick={() => {
                    handleHideReview(selectedReview._id);
                    setShowDetailModal(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  disabled={actionLoading}
                >
                  <FaEye />
                  <span>Ẩn đánh giá</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleShowReview(selectedReview._id);
                    setShowDetailModal(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  disabled={actionLoading}
                >
                  <FaEye />
                  <span>Hiện lại</span>
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement; 