import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaTrash, 
  FaCheck, 
  FaReply,
  FaEnvelope,
  FaEnvelopeOpen,
  FaCheckCircle,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope as FaEmail
} from "react-icons/fa";
import { 
  fetchAdminContacts, 
  updateContactStatus, 
  deleteContact,
  fetchContactStats,
  setFilters,
  clearFilters,
  clearError
} from "../../redux/slices/adminContactSlice";
import { toast } from 'sonner';
import ConfirmModal from "../Common/ConfirmModal";

const ContactManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { 
    contacts, 
    stats,
    pagination,
    filters,
    loading, 
    error
  } = useSelector((state) => state.adminContacts);

  // Local state
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "manager")) {
      navigate("/");
    } else {
      dispatch(fetchAdminContacts(filters));
      dispatch(fetchContactStats());
    }
  }, [user, navigate, dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ ...filters, page: newPage }));
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await dispatch(updateContactStatus({ id: contactId, status: newStatus })).unwrap();
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error) {
      toast.error(error || 'Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDeleteContact = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (contactToDelete) {
      try {
        await dispatch(deleteContact(contactToDelete._id)).unwrap();
        toast.success('Xóa tin nhắn thành công!');
        setShowDeleteModal(false);
        setContactToDelete(null);
      } catch (error) {
        toast.error(error || 'Có lỗi xảy ra khi xóa tin nhắn');
      }
    }
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
    // Tự động đánh dấu là đã đọc khi xem
    if (contact.status === 'new') {
      handleStatusChange(contact._id, 'read');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', icon: FaEnvelope, text: 'Mới' },
      read: { color: 'bg-yellow-100 text-yellow-800', icon: FaEnvelopeOpen, text: 'Đã đọc' },
      replied: { color: 'bg-green-100 text-green-800', icon: FaCheckCircle, text: 'Đã trả lời' }
    };
    
    const config = statusConfig[status] || statusConfig.new;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
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

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaTimes className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có quyền truy cập
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Chỉ Admin hoặc Manager mới có thể truy cập chức năng này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="w-19 h-19 bg-pink-100 rounded-full flex items-center justify-center p-1">
            <img src="https://cdn-icons-gif.flaticon.com/15594/15594419.gif" alt="Quản lý tin nhắn liên hệ" className="w-18 h-18 object-cover rounded-full border-2 border-white shadow" />
          </span>
          Quản lý tin nhắn liên hệ
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaFilter className="w-4 h-4 mr-2" />
            Lọc
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <FaEnvelope className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng tin nhắn</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <FaEnvelope className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tin mới</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <FaEnvelopeOpen className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đã đọc</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <FaCheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đã trả lời</p>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <FaCalendarAlt className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">7 ngày qua</p>
              <p className="text-2xl font-bold text-purple-600">{stats.recent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin nhắn..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded-r-md hover:bg-pink-600"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              </form>
            </div>
            
            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="new">Tin mới</option>
                <option value="read">Đã đọc</option>
                <option value="replied">Đã trả lời</option>
              </select>
            </div>
            
            <div>
              <button
                onClick={() => {
                  dispatch(clearFilters());
                  setSearchInput('');
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải tin nhắn...</p>
        </div>
      )}

      {/* Contacts Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người gửi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày gửi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-pink-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contact.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {contact.subject}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewContact(contact)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Xem chi tiết"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        
                        {contact.status === 'new' && (
                          <button
                            onClick={() => handleStatusChange(contact._id, 'read')}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Đánh dấu đã đọc"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                        )}
                        
                        {contact.status !== 'replied' && (
                          <button
                            onClick={() => handleStatusChange(contact._id, 'replied')}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Đánh dấu đã trả lời"
                          >
                            <FaReply className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteContact(contact)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Xóa tin nhắn"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                    </span> trong tổng số{' '}
                    <span className="font-medium">{pagination.totalItems}</span> tin nhắn
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-pink-50 border-pink-500 text-pink-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && contacts.length === 0 && (
        <div className="text-center py-12">
          <FaEnvelope className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có tin nhắn nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            Chưa có tin nhắn liên hệ nào được gửi đến.
          </p>
        </div>
      )}

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Chi tiết tin nhắn</h3>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedContact(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaUser className="inline w-4 h-4 mr-1" />
                      Họ và tên
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedContact.name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaEmail className="inline w-4 h-4 mr-1" />
                      Email
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedContact.email}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="inline w-4 h-4 mr-1" />
                      Số điện thoại
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {selectedContact.phone}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="inline w-4 h-4 mr-1" />
                      Ngày gửi
                    </label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {formatDate(selectedContact.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chủ đề
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {selectedContact.subject}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung tin nhắn
                  </label>
                  <div className="bg-gray-50 p-3 rounded max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedContact.status)}
                    <div className="flex space-x-2">
                      {selectedContact.status === 'new' && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedContact._id, 'read');
                            setSelectedContact({ ...selectedContact, status: 'read' });
                          }}
                          className="text-sm text-yellow-600 hover:text-yellow-800"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                      {selectedContact.status !== 'replied' && (
                        <button
                          onClick={() => {
                            handleStatusChange(selectedContact._id, 'replied');
                            setSelectedContact({ ...selectedContact, status: 'replied' });
                          }}
                          className="text-sm text-green-600 hover:text-green-800"
                        >
                          Đánh dấu đã trả lời
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedContact(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setContactToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa tin nhắn từ "${contactToDelete?.name}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="red"
      />
    </div>
  );
};

export default ContactManagement; 