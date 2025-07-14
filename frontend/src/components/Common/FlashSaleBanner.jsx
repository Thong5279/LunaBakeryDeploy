import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaFire, FaClock, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchActiveFlashSales } from '../../redux/slices/flashSaleSlice';

const FlashSaleBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeFlashSales, loading } = useSelector((state) => state.flashSale);
  const [currentTime, setCurrentTime] = useState(new Date());

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
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
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

  // Lấy tối đa 6 sản phẩm nổi bật nhất (có % giảm cao nhất)
  const getFeaturedItems = () => {
    if (!activeFlashSales || activeFlashSales.length === 0) return [];
    
    const allItems = [];
    activeFlashSales.forEach(flashSale => {
      flashSale.products.forEach(product => {
        const discountPercent = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
        allItems.push({
          ...product,
          type: 'product',
          discountPercent,
          endDate: flashSale.endDate
        });
      });
      
      flashSale.ingredients.forEach(ingredient => {
        const discountPercent = Math.round(((ingredient.originalPrice - ingredient.salePrice) / ingredient.originalPrice) * 100);
        allItems.push({
          ...ingredient,
          type: 'ingredient',
          discountPercent,
          endDate: flashSale.endDate
        });
      });
    });
    
    // Sắp xếp theo % giảm cao nhất và lấy 6 sản phẩm đầu
    return allItems
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, 6);
  };

  const featuredItems = getFeaturedItems();

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <span className="ml-2">Đang tải Flash Sale...</span>
        </div>
      </div>
    );
  }

  if (!activeFlashSales || activeFlashSales.length === 0 || featuredItems.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full py-8 px-2 md:px-0">
      {/* Background gradient nhẹ và overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-100 via-pink-200 to-pink-400" />
      <div className="absolute inset-0 z-0 bg-white/60 backdrop-blur-sm" />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <FaFire className="text-2xl animate-pulse text-pink-500" />
            <h2 className="text-2xl font-bold text-pink-600 tracking-wide">🔥 FLASH SALE 🔥</h2>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-end">
            <FaClock className="text-lg text-pink-500" />
            <span className="font-medium text-gray-700">Còn lại:</span>
            <span className="font-bold text-yellow-500 text-lg">
              {formatTimeRemaining(activeFlashSales[0].endDate)}
            </span>
          </div>
        </div>

        {/* Grid sản phẩm flash sale - tối đa 6 sản phẩm */}
        <div className="w-full overflow-x-auto pb-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 min-w-[320px]" style={{minWidth: '320px'}}>
            {featuredItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.type === 'product' ? item.productId._id : item.ingredientId._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center border border-pink-100 hover:border-pink-400 min-w-[180px] max-w-[200px] mx-auto group cursor-pointer"
                onClick={() => navigate(item.type === 'product' ? `/product/${item.productId._id}` : `/ingredient/${item.ingredientId._id}`)}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(item.type === 'product' ? item.productId : item.ingredientId)}
                    alt={item.type === 'product' ? item.productId.name : item.ingredientId.name}
                    className="w-20 h-20 object-cover rounded-xl mb-3 shadow group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjdmNyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                  {/* Badge giảm giá */}
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{item.discountPercent}%
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-sm text-center line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                  {item.type === 'product' ? item.productId.name : item.ingredientId.name}
                </h3>
                
                <div className="flex items-center gap-2 justify-center mb-2">
                  <span className="text-gray-400 line-through text-xs">
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="text-pink-600 font-bold text-base">
                    {formatPrice(item.salePrice)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 justify-center">
                  <FaTag className="text-pink-400 text-xs" />
                  <span className="text-pink-600 text-xs font-medium">
                    Tiết kiệm {formatPrice(item.originalPrice - item.salePrice)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-pink-600 transition-colors text-base tracking-wide border border-pink-400 hover:border-pink-600"
            onClick={() => navigate('/flash-sale')}
          >
            Xem tất cả Flash Sale ({featuredItems.length}+ sản phẩm)
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner; 