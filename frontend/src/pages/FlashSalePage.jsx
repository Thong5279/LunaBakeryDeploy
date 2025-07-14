import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaFire, FaClock, FaTag, FaChevronLeft, FaChevronRight, FaArrowLeft, FaStar, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchActiveFlashSales } from '../redux/slices/flashSaleSlice';

const FlashSalePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeFlashSales, loading } = useSelector((state) => state.flashSale);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    dispatch(fetchActiveFlashSales());
    
    // Cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const formatTimeRemaining = (endDate) => {
    const end = new Date(endDate);
    const diff = end - currentTime;
    
    if (diff <= 0) return 'Đã kết thúc';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days} ngày ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0) {
      if (typeof item.images[0] === 'string') {
        return item.images[0];
      } else if (item.images[0].url) {
        return item.images[0].url;
      }
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
  };

  // Tạo các ngôi sao và mặt trăng rơi
  const createFallingElements = () => {
    const elements = [];
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: i,
        type: Math.random() > 0.5 ? 'star' : 'moon',
        left: Math.random() * 100,
        animationDelay: Math.random() * 10,
        animationDuration: 3 + Math.random() * 4
      });
    }
    return elements;
  };

  const fallingElements = createFallingElements();

  // Tạo danh sách tất cả sản phẩm flash sale
  const getAllFlashSaleItems = () => {
    if (!activeFlashSales || activeFlashSales.length === 0) return [];
    
    const allItems = [];
    activeFlashSales.forEach(flashSale => {
      // Thêm sản phẩm
      flashSale.products.forEach(product => {
        allItems.push({
          ...product,
          type: 'product',
          flashSaleId: flashSale._id,
          endDate: flashSale.endDate
        });
      });
      
      // Thêm nguyên liệu
      flashSale.ingredients.forEach(ingredient => {
        allItems.push({
          ...ingredient,
          type: 'ingredient',
          flashSaleId: flashSale._id,
          endDate: flashSale.endDate
        });
      });
    });
    
    return allItems;
  };

  const allItems = getAllFlashSaleItems();
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleItemClick = (item) => {
    if (item.type === 'product') {
      navigate(`/product/${item.productId._id}`);
    } else {
      navigate(`/ingredient/${item.ingredientId._id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải Flash Sale...</p>
        </div>
      </div>
    );
  }

  if (!activeFlashSales || activeFlashSales.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <FaFire className="text-6xl text-pink-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Không có Flash Sale nào</h2>
          <p className="text-gray-500 mb-6">Hiện tại không có ưu đãi flash sale nào đang diễn ra.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 relative overflow-hidden">
      {/* Ngôi sao và mặt trăng rơi */}
      {fallingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute z-1 ${
            element.type === 'star' ? 'text-yellow-400/70' : 'text-pink-300/70'
          }`}
          style={{
            left: `${element.left}%`,
            top: '-20px',
            fontSize: element.type === 'star' ? '1.5rem' : '1.2rem'
          }}
          animate={{
            y: ['0vh', '100vh'],
            rotate: element.type === 'star' ? [0, 360] : [0, -360],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: element.animationDuration,
            delay: element.animationDelay,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {element.type === 'star' ? <FaStar /> : <FaMoon />}
        </motion.div>
      ))}

      {/* Overlay sparkle effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span className="font-medium">Về trang chủ</span>
            </button>
            
            <div className="flex items-center gap-3">
              <FaFire className="text-2xl animate-pulse text-pink-500" />
              <h1 className="text-2xl font-bold text-pink-600">🔥 FLASH SALE 🔥</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <FaClock className="text-lg text-pink-500" />
              <span className="font-medium text-gray-700">Còn lại:</span>
              <span className="font-bold text-yellow-500 text-lg">
                {formatTimeRemaining(activeFlashSales[0].endDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-pink-600">{allItems.length}</h3>
              <p className="text-gray-600">Sản phẩm giảm giá</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-pink-600">{activeFlashSales.length}</h3>
              <p className="text-gray-600">Đợt Flash Sale</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-pink-600">
                {Math.max(...allItems.map(item => Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100)))}
              </h3>
              <p className="text-gray-600">Giảm tối đa (%)</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.type === 'product' ? item.productId._id : item.ingredientId._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-pink-100 hover:border-pink-400 group cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(item.type === 'product' ? item.productId : item.ingredientId)}
                    alt={item.type === 'product' ? item.productId.name : item.ingredientId.name}
                    className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100)}%
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                  {item.type === 'product' ? item.productId.name : item.ingredientId.name}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 line-through text-sm">
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="text-pink-600 font-bold text-lg">
                    {formatPrice(item.salePrice)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaTag className="text-pink-400" />
                  <span>Tiết kiệm {formatPrice(item.originalPrice - item.salePrice)}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.type === 'product' ? 'Sản phẩm' : 'Nguyên liệu'}</span>
                    <span>Còn {formatTimeRemaining(item.endDate)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              <FaChevronLeft />
              Trước
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-pink-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
            >
              Sau
              <FaChevronRight />
            </button>
          </div>
        )}

        {/* Page Info */}
        <div className="text-center mt-6 text-gray-600">
          Hiển thị {startIndex + 1}-{Math.min(endIndex, allItems.length)} trong tổng số {allItems.length} sản phẩm
        </div>
      </div>
    </div>
  );
};

export default FlashSalePage; 