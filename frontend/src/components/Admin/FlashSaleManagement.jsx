import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaTag, 
  FaTrash, 
  FaEdit,
  FaEye,
  FaClock,
  FaFire
} from 'react-icons/fa';
import { 
  createFlashSale, 
  fetchFlashSales, 
  fetchAvailableItems,
  deleteFlashSale,
  clearError,
  clearSuccess 
} from '../../redux/slices/flashSaleSlice';
import { PRODUCT_CATEGORIES } from '../../constants/productConstants';
import { INGREDIENT_CATEGORIES } from '../../constants/ingredientConstants';
import axios from 'axios';

const FlashSaleManagement = () => {
  const dispatch = useDispatch();
  const { 
    flashSales, 
    availableItems, 
    loading, 
    error, 
    success, 
    message 
  } = useSelector((state) => state.flashSale);

  // State cho form tạo flash sale
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: 'percentage',
    discountValue: '',
    products: [],
    ingredients: []
  });

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // State cho modal chọn sản phẩm/nguyên liệu
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // State cho modal xem chi tiết flash sale
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFlashSale, setSelectedFlashSale] = useState(null);

  // State cho modal xác nhận xoá flash sale
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Thêm state cho giá động
  const [productPrices, setProductPrices] = useState({});
  const [ingredientPrices, setIngredientPrices] = useState({});

  // Hàm để format thời gian cho datetime-local input
  const formatDateTimeForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set thời gian mặc định khi mở form
  useEffect(() => {
    if (showCreateForm) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // 1 giờ sau
      
      setFormData(prev => ({
        ...prev,
        startDate: formatDateTimeForInput(now),
        endDate: formatDateTimeForInput(oneHourLater)
      }));
    }
  }, [showCreateForm]);

  useEffect(() => {
    dispatch(fetchFlashSales());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (success) {
      toast.success(message);
      dispatch(clearSuccess());
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        discountType: 'percentage',
        discountValue: '',
        products: [],
        ingredients: []
      });
    }
  }, [error, success, message, dispatch]);

  // Fetch giá khi mở modal chi tiết
  useEffect(() => {
    if (showDetailModal && selectedFlashSale) {
      // Lấy danh sách id sản phẩm/nguyên liệu chưa có giá
      const productsToFetch = selectedFlashSale.products.filter(p => p.price === undefined || isNaN(p.price));
      const ingredientsToFetch = selectedFlashSale.ingredients.filter(i => i.price === undefined || isNaN(i.price));
      // Fetch giá sản phẩm
      if (productsToFetch.length > 0) {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products/batch`, { ids: productsToFetch.map(p => String(getProductId(p))) })
          .then(res => {
            console.log('Kết quả batch products:', res.data);
            const prices = {};
            res.data.forEach(prod => { prices[String(prod._id)] = { price: prod.price, name: prod.name }; });
            setProductPrices(prices);
          });
      }
      // Fetch giá nguyên liệu
      if (ingredientsToFetch.length > 0) {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ingredients/batch`, { ids: ingredientsToFetch.map(i => String(getIngredientId(i))) })
          .then(res => {
            console.log('Kết quả batch ingredients:', res.data);
            const prices = {};
            res.data.forEach(ing => { prices[String(ing._id)] = { price: ing.price, name: ing.name }; });
            setIngredientPrices(prices);
          });
      }
    }
  }, [showDetailModal, selectedFlashSale]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchItems = () => {
    // Chỉ tìm kiếm nếu đã có thời gian
    if (!formData.startDate || !formData.endDate) {
      toast.error('Vui lòng chọn thời gian bắt đầu và kết thúc trước khi tìm kiếm sản phẩm');
      return;
    }

    dispatch(fetchAvailableItems({
      search: searchTerm,
      category: selectedCategory,
      type: selectedType,
      startDate: formData.startDate,
      endDate: formData.endDate
    }));
    setShowItemSelector(true);
  };

  const handleItemSelect = (item) => {
    const isSelected = selectedItems.find(selected => 
      selected._id === item._id && selected.type === item.type
    );

    if (isSelected) {
      setSelectedItems(prev => prev.filter(selected => 
        !(selected._id === item._id && selected.type === item.type)
      ));
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (itemId, itemType, quantity) => {
    setSelectedItems(prev => prev.map(item => 
      item._id === itemId && item.type === itemType 
        ? { ...item, quantity: parseInt(quantity) || 1 }
        : item
    ));
  };

  const handleConfirmItems = () => {
    const products = selectedItems.filter(item => item.type === 'product');
    const ingredients = selectedItems.filter(item => item.type === 'ingredient');
    
    setFormData(prev => ({
      ...prev,
      products: products.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        quantity: p.quantity || 1
      })),
      ingredients: ingredients.map(i => ({
        _id: i._id,
        name: i.name,
        price: i.price,
        quantity: i.quantity || 1
      }))
    }));
    
    setShowItemSelector(false);
    setSelectedItems([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate || !formData.discountValue) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }

    if (formData.products.length === 0 && formData.ingredients.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm hoặc nguyên liệu');
      return;
    }

    // Validate discountValue
    const discountValue = parseFloat(formData.discountValue);
    if (isNaN(discountValue) || discountValue <= 0) {
      toast.error('Giá trị giảm giá phải là số lớn hơn 0');
      return;
    }

    // Xử lý timezone - chuyển đổi thời gian local thành UTC
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    console.log('🕐 Flash Sale Time Debug:', {
      originalStartDate: formData.startDate,
      originalEndDate: formData.endDate,
      startDateLocal: startDate.toLocaleString('vi-VN'),
      endDateLocal: endDate.toLocaleString('vi-VN'),
      startDateUTC: startDate.toISOString(),
      endDateUTC: endDate.toISOString(),
      timezoneOffset: startDate.getTimezoneOffset()
    });

    // Chuẩn bị dữ liệu để gửi lên API
    const flashSaleData = {
      name: formData.name,
      description: formData.description || '',
      startDate: startDate.toISOString(), // Gửi dưới dạng ISO string
      endDate: endDate.toISOString(), // Gửi dưới dạng ISO string
      discountType: formData.discountType,
      discountValue: discountValue,
      products: formData.products.map(product => ({
        productId: product._id,
        quantity: product.quantity || 1
      })),
      ingredients: formData.ingredients.map(ingredient => ({
        ingredientId: ingredient._id,
        quantity: ingredient.quantity || 1
      }))
    };

    console.log('Flash Sale Data:', flashSaleData);
    
    // Gửi request với xử lý lỗi chi tiết
    dispatch(createFlashSale(flashSaleData)).then((result) => {
      if (result.error) {
        const errorMessage = result.payload;
        
        // Kiểm tra nếu có lỗi xung đột sản phẩm
        if (errorMessage.includes('đã có flash sale')) {
          // Hiển thị thông báo lỗi chi tiết
          toast.error('Không thể tạo flash sale do xung đột thời gian với flash sale khác');
          
          // Log chi tiết lỗi
          console.error('❌ Flash Sale Conflict Error:', errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    });
  };

  const handleDeleteFlashSale = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteFlashSale = () => {
    dispatch(deleteFlashSale(deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDeleteFlashSale = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleViewFlashSale = (flashSale) => {
    setSelectedFlashSale(flashSale);
    setShowDetailModal(true);
  };

  const handleEditFlashSale = () => {
    // TODO: Implement edit functionality
    toast.info('Tính năng chỉnh sửa flash sale sẽ được phát triển trong phiên bản tiếp theo');
  };

  const handleCleanupExpired = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/flash-sales/cleanup-expired`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      
      toast.success(`Đã cleanup ${response.data.expiredFlashSales} flash sale, ${response.data.cleanedCarts} giỏ hàng, ${response.data.removedItems} sản phẩm`);
      
      // Refresh danh sách flash sale
      dispatch(fetchFlashSales());
      
    } catch (error) {
      console.error('❌ Cleanup error:', error);
      toast.error('Có lỗi xảy ra khi cleanup flash sale');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh'
    });
  };

  const getStatusBadge = (flashSale) => {
    const now = new Date();
    const startDate = new Date(flashSale.startDate);
    const endDate = new Date(flashSale.endDate);

    if (now < startDate) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Sắp diễn ra</span>;
    } else if (now >= startDate && now <= endDate) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đang diễn ra</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Đã kết thúc</span>;
    }
  };

  // Thêm hàm lấy id chuẩn
  const getProductId = (product) => {
    if (product.productId && typeof product.productId === 'object' && product.productId._id)
      return product.productId._id;
    if (typeof product.productId === 'string')
      return product.productId;
    if (product._id && typeof product._id === 'string')
      return product._id;
    if (product._id && typeof product._id === 'object' && product._id._id)
      return product._id._id;
    return '';
  };
  const getIngredientId = (ingredient) => {
    if (ingredient.ingredientId && typeof ingredient.ingredientId === 'object' && ingredient.ingredientId._id)
      return ingredient.ingredientId._id;
    if (typeof ingredient.ingredientId === 'string')
      return ingredient.ingredientId;
    if (ingredient._id && typeof ingredient._id === 'string')
      return ingredient._id;
    if (ingredient._id && typeof ingredient._id === 'object' && ingredient._id._id)
      return ingredient._id._id;
    return '';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Flash Sale</h1>
              <p className="text-gray-600 mt-2">Tạo và quản lý các chương trình giảm giá nhanh</p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="https://i.pinimg.com/originals/6f/d3/43/6fd34383dcc18aa07775bf1f62af2ec1.gif" 
                alt="Flash Sale Animation" 
                className="w-20 h-20 rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={handleCleanupExpired}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
            >
              <FaTrash />
              Cleanup Flash Sale
            </motion.button>
            <motion.button
              onClick={() => setShowCreateForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-pink-600 transition-colors"
            >
              <FaPlus />
              Tạo Flash Sale
            </motion.button>
          </div>
        </div>

        {/* Flash Sales List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danh sách Flash Sale</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : flashSales.length === 0 ? (
            <div className="text-center py-8">
              <FaFire className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">Chưa có flash sale nào được tạo</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {flashSales.map((flashSale) => (
                <div key={flashSale._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{flashSale.name}</h3>
                        {getStatusBadge(flashSale)}
                      </div>
                      
                      {flashSale.description && (
                        <p className="text-gray-600 mb-3">{flashSale.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>Bắt đầu: {formatDate(flashSale.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" />
                          <span>Kết thúc: {formatDate(flashSale.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaTag className="text-gray-400" />
                          <span>
                            Giảm {flashSale.discountValue}
                            {flashSale.discountType === 'percentage' ? '%' : '₫'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Sản phẩm:</span> {flashSale.products.length} | 
                        <span className="font-medium ml-2">Nguyên liệu:</span> {flashSale.ingredients.length}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewFlashSale(flashSale)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleEditFlashSale(flashSale)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteFlashSale(flashSale._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Flash Sale Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tạo Flash Sale Mới</h2>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên Flash Sale *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Nhập tên flash sale"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Mô tả flash sale"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày kết thúc *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                </div>

                {/* Discount Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại giảm giá *
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (₫)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị giảm giá *
                    </label>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder={formData.discountType === 'percentage' ? 'Nhập phần trăm' : 'Nhập số tiền'}
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Item Selection */}
                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Chọn sản phẩm và nguyên liệu</h3>
                    <button
                      type="button"
                      onClick={handleSearchItems}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <FaSearch className="inline mr-2" />
                      Tìm kiếm
                    </button>
                  </div>

                  {/* Selected Items Display */}
                  {(formData.products.length > 0 || formData.ingredients.length > 0) && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Sản phẩm đã chọn:</h4>
                      {formData.products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <span>{product.name}</span>
                          <span className="text-sm text-gray-500">
                            SL: {product.quantity} | Giá: {formatPrice(product.price)}
                          </span>
                        </div>
                      ))}
                      
                      <h4 className="font-medium text-gray-700">Nguyên liệu đã chọn:</h4>
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                          <span>{ingredient.name}</span>
                          <span className="text-sm text-gray-500">
                            SL: {ingredient.quantity} | Giá: {formatPrice(ingredient.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Đang tạo...' : 'Tạo Flash Sale'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Item Selector Modal */}
        {showItemSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Chọn sản phẩm và nguyên liệu</h2>
                <button 
                  onClick={() => setShowItemSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Tất cả danh mục</option>
                  {/* Danh mục sản phẩm */}
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  {/* Danh mục nguyên liệu */}
                  {INGREDIENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Tất cả loại</option>
                  <option value="products">Chỉ sản phẩm</option>
                  <option value="ingredients">Chỉ nguyên liệu</option>
                </select>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleSearchItems}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  <FaSearch className="inline mr-2" />
                  Tìm kiếm
                </button>
              </div>

              {/* Items Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableItems.products.map((product) => (
                  <div
                    key={`product-${product._id}`}
                    onClick={() => handleItemSelect(product)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedItems.find(item => item._id === product._id && item.type === 'product')
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selectedItems.find(item => item._id === product._id && item.type === 'product')}
                        onChange={() => {}}
                        className="text-pink-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm font-medium text-pink-600">{formatPrice(product.price)}</p>
                        <p className="text-xs text-gray-500">Còn: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {availableItems.ingredients.map((ingredient) => (
                  <div
                    key={`ingredient-${ingredient._id}`}
                    onClick={() => handleItemSelect(ingredient)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedItems.find(item => item._id === ingredient._id && item.type === 'ingredient')
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selectedItems.find(item => item._id === ingredient._id && item.type === 'ingredient')}
                        onChange={() => {}}
                        className="text-pink-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{ingredient.name}</h4>
                        <p className="text-sm text-gray-600">{ingredient.category}</p>
                        <p className="text-sm font-medium text-pink-600">{formatPrice(ingredient.price)}</p>
                        <p className="text-xs text-gray-500">Còn: {ingredient.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confirm Button */}
              <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowItemSelector(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmItems}
                  className="px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                >
                  Xác nhận ({selectedItems.length} items)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Flash Sale Detail Modal */}
        {showDetailModal && selectedFlashSale && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết Flash Sale</h2>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedFlashSale.name}</h3>
                  {selectedFlashSale.description && (
                    <p className="text-gray-600 mb-4">{selectedFlashSale.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-pink-500" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                        <p className="font-medium">{formatDate(selectedFlashSale.startDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaClock className="text-pink-500" />
                      <div>
                        <p className="text-sm text-gray-500">Ngày kết thúc</p>
                        <p className="font-medium">{formatDate(selectedFlashSale.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount Information */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giảm giá</h4>
                  <div className="flex items-center gap-3">
                    <FaTag className="text-blue-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Loại giảm giá</p>
                      <p className="font-medium">
                        {selectedFlashSale.discountType === 'percentage' ? 'Phần trăm (%)' : 'Số tiền cố định (₫)'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Giá trị giảm</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedFlashSale.discountValue}
                      {selectedFlashSale.discountType === 'percentage' ? '%' : ' ₫'}
                    </p>
                  </div>
                </div>

                {/* Items Information */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm và nguyên liệu</h4>
                  
                  {selectedFlashSale.products.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Sản phẩm ({selectedFlashSale.products.length})</h5>
                      <div className="space-y-2">
                        {selectedFlashSale.products.map((product, index) => (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                            <span className="font-medium">
                              {product.name
                                || (product.productId && product.productId.name)
                                || (productPrices[String(getProductId(product))] && productPrices[String(getProductId(product))].name) || `Không khớp ID: ${getProductId(product)}`}
                            </span>
                            <span className="text-sm text-gray-500">
                              {product.price !== undefined && !isNaN(product.price)
                                ? formatPrice(product.price)
                                : (productPrices[String(getProductId(product))] && productPrices[String(getProductId(product))].price !== undefined
                                    ? formatPrice(productPrices[String(getProductId(product))].price)
                                    : `Không khớp ID: ${getProductId(product)}`)
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedFlashSale.ingredients.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Nguyên liệu ({selectedFlashSale.ingredients.length})</h5>
                      <div className="space-y-2">
                        {selectedFlashSale.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                            <span className="font-medium">
                              {ingredient.name
                                || (ingredient.ingredientId && ingredient.ingredientId.name)
                                || (ingredientPrices[String(getIngredientId(ingredient))] && ingredientPrices[String(getIngredientId(ingredient))].name) || `Không khớp ID: ${getIngredientId(ingredient)}`}
                            </span>
                            <span className="text-sm text-gray-500">
                              {ingredient.price !== undefined && !isNaN(ingredient.price)
                                ? formatPrice(ingredient.price)
                                : (ingredientPrices[String(getIngredientId(ingredient))] && ingredientPrices[String(getIngredientId(ingredient))].price !== undefined
                                    ? formatPrice(ingredientPrices[String(getIngredientId(ingredient))].price)
                                    : `Không khớp ID: ${getIngredientId(ingredient)}`)
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái</h4>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedFlashSale)}
                    <span className="text-sm text-gray-600">
                      {(() => {
                        const now = new Date();
                        const startDate = new Date(selectedFlashSale.startDate);
                        const endDate = new Date(selectedFlashSale.endDate);
                        if (now < startDate) {
                          const diff = startDate - now;
                          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          if (days > 0) return `Còn ${days} ngày nữa sẽ bắt đầu`;
                          if (hours > 0) return `Còn ${hours} giờ nữa sẽ bắt đầu`;
                          return `Còn ${minutes} phút nữa sẽ bắt đầu`;
                        } else if (now >= startDate && now <= endDate) {
                          const diff = endDate - now;
                          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          if (days > 0) return `Còn ${days} ngày nữa sẽ kết thúc`;
                          if (hours > 0) return `Còn ${hours} giờ nữa sẽ kết thúc`;
                          return `Còn ${minutes} phút nữa sẽ kết thúc`;
                        } else {
                          return 'Đã kết thúc';
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-6 border-t mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận xoá flash sale */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-red-600">Xác nhận xoá Flash Sale</h2>
              <p className="mb-6 text-gray-700">Bạn có chắc chắn muốn xoá flash sale này? Hành động này không thể hoàn tác.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelDeleteFlashSale}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={confirmDeleteFlashSale}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSaleManagement; 